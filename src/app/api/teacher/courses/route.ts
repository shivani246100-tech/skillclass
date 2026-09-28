import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApprovalStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const teacher = await requireUser(["TEACHER"]);

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher login required." },
        { status: 401 }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        teacherId: teacher.id,
      },
      select: {
        id: true,
        title: true,
        approvalStatus: true,
        active: true,
        monthlyFee: true,
        startDate: true,
        startTime: true,
        endTime: true,
        schedule: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      courses,
    });
  } catch (error) {
    console.error("Teacher courses GET error:", error);

    return NextResponse.json(
      { error: "Failed to load teacher courses." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const teacher = await requireUser(["TEACHER"]);

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher login required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      monthlyFee,
      categoryId,
      startDate,
      startTime,
      endTime,
      schedule,
    } = body;

    const cleanTitle = String(title || "").trim();
    const cleanDescription = String(description || "").trim();
    const fee = Number(monthlyFee);

    if (
      !cleanTitle ||
      !cleanDescription ||
      !Number.isFinite(fee) ||
      fee <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "title, description and a valid monthlyFee are required.",
        },
        { status: 400 }
      );
    }

    let parsedStartDate: Date | null = null;

    if (startDate) {
      parsedStartDate = new Date(startDate);

      if (Number.isNaN(parsedStartDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid start date." },
          { status: 400 }
        );
      }
    }

    const slug =
      cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now();

    const course = await prisma.course.create({
      data: {
        teacherId: teacher.id,
        title: cleanTitle,
        slug,
        description: cleanDescription,
        monthlyFee: Math.round(fee),
        categoryId: categoryId || null,
        startDate: parsedStartDate,
        startTime: startTime ? String(startTime) : null,
        endTime: endTime ? String(endTime) : null,
        schedule: schedule ? String(schedule).trim() : null,
        approvalStatus: ApprovalStatus.PENDING_APPROVAL,
        active: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course submitted for admin approval.",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);

    return NextResponse.json(
      { error: "Failed to create course." },
      { status: 500 }
    );
  }
}