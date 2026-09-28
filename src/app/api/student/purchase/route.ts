import { NextResponse } from "next/server";
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

    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId: course.id,
        },
      },
    });

    if (
      existingSubscription &&
      existingSubscription.status === "ACTIVE" &&
      existingSubscription.endDate > new Date()
    ) {
      return NextResponse.json(
        { error: "You already have an active subscription." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        userId: student.id,
        courseId: course.id,
        amount: course.monthlyFee,
        commission: 0,
        recipientAmount: course.monthlyFee,
        status: "PENDING_APPROVAL",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course purchase request created.",
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
        },
        course: {
          id: course.id,
          title: course.title,
          monthlyFee: course.monthlyFee,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Course purchase error:", error);

    return NextResponse.json(
      { error: "Unable to create course purchase request." },
      { status: 500 }
    );
  }
}