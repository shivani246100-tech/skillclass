import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required." },
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

    const amount = Number(course.monthlyFee);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid course price." },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `course_${course.id}_${Date.now()}`,
      notes: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      course: {
        id: course.id,
        title: course.title,
        amount,
      },
      student: {
        name: student.name,
        email: student.email,
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    return NextResponse.json(
      { error: "Unable to create payment order." },
      { status: 500 }
    );
  }
}