import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSession } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const mobile =
      String(body.mobile || "").trim() || null;

    const password = String(body.password || "");

    const roleInput = String(body.role || "")
      .trim()
      .toUpperCase();

    // ONLY THESE THREE ROLES
    // CAN REGISTER FROM PUBLIC REGISTER PAGE.

    const allowedRoles: Role[] = [
      Role.STUDENT,
      Role.TEACHER,
      Role.SELLER,
    ];

    // NAME VALIDATION

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Please enter your full name.",
        },
        {
          status: 400,
        }
      );
    }

    // EMAIL VALIDATION

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    // PASSWORD VALIDATION

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    // ROLE VALIDATION
    //
    // ADMIN IS NOT ALLOWED.
    // Only Student, Teacher and Seller.

    if (!allowedRoles.includes(roleInput as Role)) {
      return NextResponse.json(
        {
          error:
            "Please select Student, Teacher, or Seller. Admin accounts are managed by the owner.",
        },
        {
          status: 400,
        }
      );
    }

    const role = roleInput as Role;

    // CHECK EXISTING USER

    const existing =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // CREATE USER

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,

        passwordHash:
          hashPassword(password),

        role,

        // CREATE WALLET
        // FOR TEACHER AND SELLER

        wallet:
          role === Role.TEACHER ||
          role === Role.SELLER
            ? {
                create: {},
              }
            : undefined,

        // CREATE TEACHER PROFILE

        teacherProfile:
          role === Role.TEACHER
            ? {
                create: {},
              }
            : undefined,

        // CREATE SELLER PROFILE

        sellerProfile:
          role === Role.SELLER
            ? {
                create: {},
              }
            : undefined,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // CREATE LOGIN SESSION

    await setSession(user.id);

    // ROLE BASED REDIRECT

    let redirectTo = "/";

    if (role === Role.STUDENT) {
      redirectTo = "/dashboard/student";
    }

    if (role === Role.TEACHER) {
      redirectTo = "/dashboard/teacher";
    }

    if (role === Role.SELLER) {
      redirectTo = "/dashboard/seller";
    }

    return NextResponse.json({
      ok: true,
      user,
      redirectTo,
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create account. Check your database configuration.",
      },
      {
        status: 500,
      }
    );
  }
}