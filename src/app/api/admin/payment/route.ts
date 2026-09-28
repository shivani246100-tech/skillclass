import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, LedgerType } from "@prisma/client";
import { requireUser } from "@/lib/auth";

const TEACHER_PLATFORM_PERCENT = 20;
const SELLER_PLATFORM_PERCENT = 10;

export async function GET() {
  try {
    const admin = await requireUser(["ADMIN"]);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const payments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.PENDING_APPROVAL,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            monthlyFee: true,
            teacherId: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        pdfBook: {
          select: {
            id: true,
            title: true,
            price: true,
            sellerId: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Admin payments GET error:", error);

    return NextResponse.json(
      { error: "Failed to load pending payments." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireUser(["ADMIN"]);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const paymentId = String(body.paymentId || "").trim();
    const action = String(body.action || "").trim();

    if (
      !paymentId ||
      !["approve", "reject"].includes(action)
    ) {
      return NextResponse.json(
        {
          error: "paymentId and valid action are required.",
        },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        course: {
          include: {
            teacher: true,
          },
        },
        pdfBook: {
          include: {
            seller: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found." },
        { status: 404 }
      );
    }

    if (payment.status !== PaymentStatus.PENDING_APPROVAL) {
      return NextResponse.json(
        {
          error: "This payment is no longer pending.",
        },
        { status: 400 }
      );
    }

    /*
     * REJECT PAYMENT
     */
    if (action === "reject") {
      const updatedPayment = await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: PaymentStatus.REJECTED,
        },
      });

      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Payment Rejected",
          message:
            "Your payment could not be approved by the admin.",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Payment rejected.",
        payment: updatedPayment,
      });
    }

    /*
     * PAYMENT MUST BELONG TO COURSE OR PDF BOOK
     */
    if (!payment.course && !payment.pdfBook) {
      return NextResponse.json(
        {
          error:
            "Payment is not linked to a course or PDF book.",
        },
        { status: 400 }
      );
    }

    /*
     * COURSE PAYMENT
     */
    if (payment.course) {
      const teacher = payment.course.teacher;

      const platformAmount = Math.round(
        (payment.amount * TEACHER_PLATFORM_PERCENT) / 100
      );

      const teacherAmount =
        payment.amount - platformAmount;

      const now = new Date();

      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);

      const result = await prisma.$transaction(
        async (tx) => {
          /*
           * Platform/Admin wallet
           */
          const platformWallet =
            await tx.wallet.upsert({
              where: {
                userId: admin.id,
              },
              update: {},
              create: {
                userId: admin.id,
                balance: 0,
              },
            });

          /*
           * Teacher wallet
           */
          const teacherWallet =
            await tx.wallet.upsert({
              where: {
                userId: teacher.id,
              },
              update: {},
              create: {
                userId: teacher.id,
                balance: 0,
              },
            });

          /*
           * Teacher wallet CREDIT
           */
          await tx.wallet.update({
            where: {
              id: teacherWallet.id,
            },
            data: {
              balance: {
                increment: teacherAmount,
              },
            },
          });

          await tx.walletEntry.create({
            data: {
              walletId: teacherWallet.id,
              type: LedgerType.CREDIT,
              amount: teacherAmount,
              referenceId: payment.id,
              description:
                `Teacher earning for course "${payment.course!.title}"`,
            },
          });

          /*
           * Platform wallet already represents the gross
           * payment. Settlement removes teacher share.
           * Platform commission remains in platform wallet.
           */
          await tx.wallet.update({
            where: {
              id: platformWallet.id,
            },
            data: {
              balance: {
                increment: -teacherAmount,
              },
            },
          });

          await tx.walletEntry.create({
            data: {
              walletId: platformWallet.id,
              type: LedgerType.DEBIT,
              amount: teacherAmount,
              referenceId: payment.id,
              description:
                `Teacher settlement for course "${payment.course!.title}"`,
            },
          });

          /*
           * Update payment
           */
          const updatedPayment =
            await tx.payment.update({
              where: {
                id: payment.id,
              },
              data: {
                status: PaymentStatus.APPROVED,
                approvedAt: now,
                commission: platformAmount,
                recipientAmount: teacherAmount,
              },
            });

          /*
           * Activate student subscription
           */
          const subscription =
            await tx.subscription.upsert({
              where: {
                studentId_courseId: {
                  studentId: payment.userId,
                  courseId: payment.course!.id,
                },
              },
              update: {
                startDate: now,
                endDate,
                status: "ACTIVE",
              },
              create: {
                studentId: payment.userId,
                courseId: payment.course!.id,
                startDate: now,
                endDate,
                status: "ACTIVE",
              },
            });

          /*
           * Student notification
           */
          await tx.notification.create({
            data: {
              userId: payment.userId,
              title: "Course Purchase Approved",
              message: `Your payment for "${payment.course!.title}" has been approved. Your subscription is active until ${endDate.toLocaleDateString(
                "en-IN"
              )}.`,
            },
          });

          /*
           * Teacher notification
           */
          await tx.notification.create({
            data: {
              userId: teacher.id,
              title: "Payment Settled",
              message: `₹${teacherAmount.toLocaleString(
                "en-IN"
              )} has been credited to your wallet for "${payment.course!.title}". Platform commission: ₹${platformAmount.toLocaleString(
                "en-IN"
              )}.`,
            },
          });

          /*
           * Audit log
           */
          await tx.auditLog.create({
            data: {
              adminId: admin.id,
              action: "COURSE_PAYMENT_SETTLED",
              targetType: "PAYMENT",
              targetId: payment.id,
              previous: JSON.stringify({
                status: payment.status,
                commission: payment.commission,
                recipientAmount:
                  payment.recipientAmount,
              }),
              next: JSON.stringify({
                status: "APPROVED",
                commission: platformAmount,
                recipientAmount: teacherAmount,
              }),
            },
          });

          return {
            updatedPayment,
            subscription,
            platformAmount,
            teacherAmount,
          };
        }
      );

      return NextResponse.json({
        success: true,
        message:
          "Course payment approved and teacher settlement completed.",
        payment: result.updatedPayment,
        subscription: result.subscription,
        settlement: {
          grossAmount: payment.amount,
          platformCommission: result.platformAmount,
          teacherAmount: result.teacherAmount,
        },
      });
    }

    /*
     * PDF BOOK PAYMENT
     */
    if (payment.pdfBook) {
      const seller = payment.pdfBook.seller;

      const platformAmount = Math.round(
        (payment.amount * SELLER_PLATFORM_PERCENT) / 100
      );

      const sellerAmount =
        payment.amount - platformAmount;

      const now = new Date();

      const result = await prisma.$transaction(
        async (tx) => {
          /*
           * Platform/Admin wallet
           */
          const platformWallet =
            await tx.wallet.upsert({
              where: {
                userId: admin.id,
              },
              update: {},
              create: {
                userId: admin.id,
                balance: 0,
              },
            });

          /*
           * Seller wallet
           */
          const sellerWallet =
            await tx.wallet.upsert({
              where: {
                userId: seller.id,
              },
              update: {},
              create: {
                userId: seller.id,
                balance: 0,
              },
            });

          /*
           * Seller wallet CREDIT
           */
          await tx.wallet.update({
            where: {
              id: sellerWallet.id,
            },
            data: {
              balance: {
                increment: sellerAmount,
              },
            },
          });

          await tx.walletEntry.create({
            data: {
              walletId: sellerWallet.id,
              type: LedgerType.CREDIT,
              amount: sellerAmount,
              referenceId: payment.id,
              description:
                `Seller earning for PDF "${payment.pdfBook!.title}"`,
            },
          });

          /*
           * Remove seller share from platform wallet.
           * Remaining balance is platform commission.
           */
          await tx.wallet.update({
            where: {
              id: platformWallet.id,
            },
            data: {
              balance: {
                increment: -sellerAmount,
              },
            },
          });

          await tx.walletEntry.create({
            data: {
              walletId: platformWallet.id,
              type: LedgerType.DEBIT,
              amount: sellerAmount,
              referenceId: payment.id,
              description:
                `Seller settlement for PDF "${payment.pdfBook!.title}"`,
            },
          });

          /*
           * Update payment
           */
          const updatedPayment =
            await tx.payment.update({
              where: {
                id: payment.id,
              },
              data: {
                status: PaymentStatus.APPROVED,
                approvedAt: now,
                commission: platformAmount,
                recipientAmount: sellerAmount,
              },
            });

          /*
           * Give student PDF access
           */
          const purchase =
            await tx.pdfPurchase.upsert({
              where: {
                studentId_pdfBookId: {
                  studentId: payment.userId,
                  pdfBookId: payment.pdfBook!.id,
                },
              },
              update: {},
              create: {
                studentId: payment.userId,
                pdfBookId: payment.pdfBook!.id,
              },
            });

          /*
           * Student notification
           */
          await tx.notification.create({
            data: {
              userId: payment.userId,
              title: "PDF Purchase Approved",
              message: `Your purchase of "${payment.pdfBook!.title}" has been approved. You can now access the PDF.`,
            },
          });

          /*
           * Seller notification
           */
          await tx.notification.create({
            data: {
              userId: seller.id,
              title: "PDF Payment Settled",
              message: `₹${sellerAmount.toLocaleString(
                "en-IN"
              )} has been credited to your wallet for "${payment.pdfBook!.title}". Platform commission: ₹${platformAmount.toLocaleString(
                "en-IN"
              )}.`,
            },
          });

          /*
           * Audit log
           */
          await tx.auditLog.create({
            data: {
              adminId: admin.id,
              action: "PDF_PAYMENT_SETTLED",
              targetType: "PAYMENT",
              targetId: payment.id,
              previous: JSON.stringify({
                status: payment.status,
                commission: payment.commission,
                recipientAmount:
                  payment.recipientAmount,
              }),
              next: JSON.stringify({
                status: "APPROVED",
                commission: platformAmount,
                recipientAmount: sellerAmount,
              }),
            },
          });

          return {
            updatedPayment,
            purchase,
            platformAmount,
            sellerAmount,
          };
        }
      );

      return NextResponse.json({
        success: true,
        message:
          "PDF payment approved and seller settlement completed.",
        payment: result.updatedPayment,
        purchase: result.purchase,
        settlement: {
          grossAmount: payment.amount,
          platformCommission: result.platformAmount,
          sellerAmount: result.sellerAmount,
        },
      });
    }

    return NextResponse.json(
      { error: "Unsupported payment type." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin payment POST error:", error);

    return NextResponse.json(
      {
        error: "Failed to process payment settlement.",
      },
      { status: 500 }
    );
  }
}