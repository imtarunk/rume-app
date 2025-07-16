import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;
  const resume = await prisma.resume.findFirst({ where: { userId } });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const template = await prisma.portfolio.findUnique({
    where: {
      userId: userId,
    },
    select: {
      templateId: true,
      userId: true,
      isPublished: true,
    },
  });
  console.log("resume", resume, resume?.parsedData);
  if (!resume)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsedData =
    typeof resume.parsedData === "object" && resume.parsedData !== null
      ? resume.parsedData
      : {};
  return NextResponse.json({
    ...parsedData,
    image:
      user?.image ||
      "https://i.pinimg.com/736x/08/64/6b/08646bdb5afb82a90a9ce32827a8745f.jpg",
    templateId: template?.templateId || null,
    isPublished: template?.isPublished || false,
  });
}
