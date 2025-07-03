import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId, templateId, isPublished } = await request.json();

    if (!userId && !templateId && typeof isPublished === "undefined") {
      return NextResponse.json(
        { error: "userId and templateId or isPublished are required" },
        { status: 400 }
      );
    }

    // Build update object
    const updateObj: any = {};
    if (templateId) updateObj.templateId = templateId;
    if (typeof isPublished === "boolean") updateObj.isPublished = isPublished;

    // Upsert or update portfolio settings
    const portfolio = await prisma.portfolio.upsert({
      where: { userId },
      update: updateObj,
      create: {
        userId,
        templateId: templateId || "classic-v1",
        isPublished: typeof isPublished === "boolean" ? isPublished : false,
      },
    });

    return NextResponse.json({ success: true, portfolio });
  } catch (error) {
    console.error("Template update error:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  try {
    const portfolio = await prisma.portfolio.findUnique({ where: { userId } });
    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
