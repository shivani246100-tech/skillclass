import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApprovalStatus } from "@prisma/client";
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

    const courses = await prisma.course.findMany({
      where: {
        approvalStatus: ApprovalStatus.PENDING_APPROVAL,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      courses,
    });
  } catch (error) {
    console.error("Admin courses GET error:", error);

    return NextResponse.json(
      { error: "Failed to load pending courses." },
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

    const courseId = String(body.courseId || "");
    const action = String(body.action || "");

    if (!courseId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "courseId and valid action are required." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    if (
      course.approvalStatus !== ApprovalStatus.PENDING_APPROVAL
    ) {
      return NextResponse.json(
        { error: "This course is no longer pending approval." },
        { status: 400 }
      );
    }

    const newStatus =
      action === "approve"
        ? ApprovalStatus.APPROVED
        : ApprovalStatus.REJECTED;

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        approvalStatus: newStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "Course approved successfully."
          : "Course rejected successfully.",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Admin courses POST error:", error);

    return NextResponse.json(
      { error: "Failed to update course approval." },
      { status: 500 }
    );
  }
}