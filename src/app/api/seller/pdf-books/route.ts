import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "SELLER" || !user.active) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    const formData = await request.formData();

    const file = formData.get("file");

    const title = String(
      formData.get("title") || ""
    ).trim();

    const description = String(
      formData.get("description") || ""
    ).trim();

    const price = Number(
      formData.get("price") || 0
    );

    const author = String(
      formData.get("author") || ""
    ).trim();

    const language = String(
      formData.get("language") || ""
    ).trim();

    const categoryId = String(
      formData.get("categoryId") || ""
    ).trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select a PDF file." },
        { status: 400 }
      );
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    if (
      !title ||
      !description ||
      !price ||
      price < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Title, description and valid price are required.",
        },
        { status: 400 }
      );
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            "PDF size must be 20MB or less.",
        },
        { status: 400 }
      );
    }

    const safeName = file.name
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      )
      .replace(/-+/g, "-");

    const storageKey =
      `seller/${user.id}/${Date.now()}-${safeName}`;

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const { error: uploadError } =
      await supabase.storage
        .from("skillclass-pdfs")
        .upload(
          storageKey,
          buffer,
          {
            contentType: "application/pdf",
            upsert: false,
          }
        );

    if (uploadError) {
      console.error(
        "Supabase upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Unable to upload PDF.",
        },
        { status: 500 }
      );
    }

    const slugBase = title
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        "");

    const slug =
      `${slugBase || "pdf-book"}-${Date.now()}`;

    const book =
      await prisma.pdfBook.create({
        data: {
          sellerId: user.id,
          categoryId:
            categoryId || null,
          title,
          slug,
          description,
          storageKey,
          price: Math.round(price),
          author: author || null,
          language: language || null,
          approvalStatus:
            "PENDING_APPROVAL",
        },
      });

    return NextResponse.json({
      ok: true,
      book: {
        id: book.id,
        title: book.title,
        status:
          book.approvalStatus,
      },
    });
  } catch (error) {
    console.error(
      "Seller PDF upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while uploading the PDF.",
      },
      { status: 500 }
    );
  }
}