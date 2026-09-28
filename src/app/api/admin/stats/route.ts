import { NextResponse } from "next/server";
import {
  PrismaClient,
  ApprovalStatus,
  PaymentStatus,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      students,
      teachers,
      sellers,
      pendingPayments,
      pendingCourses,
      pendingPdfBooks,
      approvedPayments,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: Role.STUDENT },
      }),

      prisma.user.count({
        where: { role: Role.TEACHER },
      }),

      prisma.user.count({
        where: { role: Role.SELLER },
      }),

      prisma.payment.count({
        where: {
          status: PaymentStatus.PENDING_APPROVAL,
        },
      }),

      prisma.course.count({
        where: {
          approvalStatus: ApprovalStatus.PENDING_APPROVAL,
        },
      }),

      prisma.pdfBook.count({
        where: {
          approvalStatus: ApprovalStatus.PENDING_APPROVAL,
        },
      }),

      prisma.payment.aggregate({
        where: {
          status: PaymentStatus.APPROVED,
        },
        _sum: {
          commission: true,
        },
      }),
    ]);

    return NextResponse.json({
      students,
      teachers,
      sellers,
      pendingPayments,
      pendingCourses,
      pendingPdfBooks,
      platformEarnings: approvedPayments._sum.commission ?? 0,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return NextResponse.json(
      {
        error: "Failed to load admin statistics.",
      },
      { status: 500 }
    );
  }
}