import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const course = await prisma.course.findFirst({
      where: {
        slug,
        approvalStatus: "APPROVED",
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      course,
    });
  } catch (error) {
    console.error("Course API error:", error);

    return NextResponse.json(
      { error: "Unable to load course." },
      { status: 500 }
    );
  }
}
