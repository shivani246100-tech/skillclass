import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const sessions = await prisma.liveSession.findMany({
      where: {
        course: {
          teacherId: teacher.id,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Teacher sessions GET error:", error);

    return NextResponse.json(
      { error: "Failed to load live sessions." },
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

    const courseId = String(body.courseId || "");
    const title = String(body.title || "").trim();
    const startsAt = String(body.startsAt || "");
    const endsAt = String(body.endsAt || "");
    const joinUrl = String(body.joinUrl || "").trim();

    if (!courseId || !title || !startsAt) {
      return NextResponse.json(
        {
          error: "courseId, title and startsAt are required.",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: teacher.id,
        approvalStatus: "APPROVED",
        active: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          error:
            "Course not found or you are not allowed to create a session for this course.",
        },
        { status: 403 }
      );
    }

    const startDate = new Date(startsAt);

    if (Number.isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid start date/time." },
        { status: 400 }
      );
    }

    let endDate: Date | null = null;

    if (endsAt) {
      endDate = new Date(endsAt);

      if (Number.isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid end date/time." },
          { status: 400 }
        );
      }

      if (endDate <= startDate) {
        return NextResponse.json(
          { error: "End time must be after start time." },
          { status: 400 }
        );
      }
    }

    const session = await prisma.liveSession.create({
      data: {
        courseId: course.id,
        title,
        startsAt: startDate,
        endsAt: endDate,
        joinUrl: joinUrl || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Live session created successfully.",
        session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create live session error:", error);

    return NextResponse.json(
      {
        error: "Failed to create live session.",
      },
      { status: 500 }
    );
  }
}