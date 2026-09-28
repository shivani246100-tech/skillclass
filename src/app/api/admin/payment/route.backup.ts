import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";

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

    const paymentId = String(body.paymentId || "");
    const action = String(body.action || "");

    if (
      !paymentId ||
      !["approve", "reject"].includes(action)
    ) {
      return NextResponse.json(
        {
          error:
            "paymentId and valid action are required.",
        },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        course: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found." },
        { status: 404 }
      );
    }

    if (
      payment.status !==
      PaymentStatus.PENDING_APPROVAL
    ) {
      return NextResponse.json(
        {
          error:
            "This payment is no longer pending.",
        },
        { status: 400 }
      );
    }

    if (action === "reject") {
      const updatedPayment =
        await prisma.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: PaymentStatus.REJECTED,
          },
        });

      return NextResponse.json({
        success: true,
        message: "Payment rejected.",
        payment: updatedPayment,
      });
    }

    if (!payment.course) {
      return NextResponse.json(
        { error: "Course not found for this payment." },
        { status: 400 }
      );
    }

    const now = new Date();

    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    const result = await prisma.$transaction(
      async (tx) => {
        const updatedPayment =
          await tx.payment.update({
            where: {
              id: paymentId,
            },
            data: {
              status: PaymentStatus.APPROVED,
              approvedAt: now,
            },
          });

        const subscription =
          await tx.subscription.upsert({
            where: {
              studentId_courseId: {
                studentId: payment.userId,
                courseId: payment.courseId!,
              },
            },
            update: {
              startDate: now,
              endDate,
              status: "ACTIVE",
            },
            create: {
              studentId: payment.userId,
              courseId: payment.courseId!,
              startDate: now,
              endDate,
              status: "ACTIVE",
            },
          });

        await tx.notification.create({
          data: {
            userId: payment.userId,
            title: "Course Purchase Approved",
            message: `Your payment for {title} has been approved. Your subscription is active until ${endDate.toLocaleDateString(
              "en-IN"
            )}.`,
          },
        });

        return {
          updatedPayment,
          subscription,
        };
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Payment approved and subscription activated.",
      payment: result.updatedPayment,
      subscription: result.subscription,
    });
  } catch (error) {
    console.error("Admin payment POST error:", error);

    return NextResponse.json(
      {
        error:
          "Failed to process payment approval.",
      },
      { status: 500 }
    );
  }
}