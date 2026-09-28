import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Auth me error:", error);

    return NextResponse.json(
      { error: "Failed to get current user" },
      { status: 500 }
    );
  }
}