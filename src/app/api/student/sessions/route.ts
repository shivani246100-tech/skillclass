import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const student = await requireUser(["STUDENT"]);

    if (!student) {
      return NextResponse.json(
        { error: "Student login required." },
        { status: 401 }
      );
    }

    const now = new Date();

    const subscriptions = await prisma.subscription.findMany({
      where: {
        studentId: student.id,
        status: "ACTIVE",
        endDate: {
          gte: now,
        },
        course: {
          active: true,
          approvalStatus: "APPROVED",
        },
      },
      select: {
        courseId: true,
      },
    });

    const courseIds = subscriptions.map(
      (subscription) => subscription.courseId
    );

    if (courseIds.length === 0) {
      return NextResponse.json({
        sessions: [],
      });
    }

    const sessions = await prisma.liveSession.findMany({
      where: {
        courseId: {
          in: courseIds,
        },
        startsAt: {
          gte: now,
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

    return NextResponse.json({
      sessions,
    });
  } catch (error) {
    console.error("Student sessions GET error:", error);

    return NextResponse.json(
      { error: "Failed to load live sessions." },
      { status: 500 }
    );
  }
}