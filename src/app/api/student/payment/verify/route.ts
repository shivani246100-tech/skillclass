import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const student = await requireUser(["STUDENT"]);

    if (!student) {
      return NextResponse.json(
        { error: "Student login required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const courseId = String(body.courseId || "").trim();
    const orderId = String(body.orderId || "").trim();
    const paymentId = String(body.paymentId || "").trim();
    const signature = String(body.signature || "").trim();

    if (!courseId || !orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Payment verification details are incomplete." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        approvalStatus: "APPROVED",
        active: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or not available." },
        { status: 404 }
      );
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpaySecret) {
      return NextResponse.json(
        { error: "Razorpay configuration is missing." },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (
      generatedSignature.length !== signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(signature)
      )
    ) {
      return NextResponse.json(
        { error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        OR: [
          {
            gatewayPaymentId: paymentId,
          },
          {
            userId: student.id,
            courseId: course.id,
            gatewayOrderId: orderId,
          },
        ],
      },
    });

    if (existingPayment) {
      return NextResponse.json({
        success: true,
        message: "Payment already recorded.",
        payment: {
          id: existingPayment.id,
          amount: existingPayment.amount,
          status: existingPayment.status,
        },
      });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: student.id,
        courseId: course.id,
        amount: course.monthlyFee,

        // Final commission Admin Settlement ke time calculate hoga.
        commission: 0,
        recipientAmount: 0,

        // Payment successful hai, lekin Admin settlement abhi pending hai.
        status: "PENDING_APPROVAL",

        gatewayOrderId: orderId,
        gatewayPaymentId: paymentId,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Payment verified successfully. Payment is now pending admin settlement.",
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 }
    );
  }
}