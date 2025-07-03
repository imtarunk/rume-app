import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    // Validation
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum 10MB allowed." },
        { status: 400 }
      );
    }

    // File type validation
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/json",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload PDF, DOCX, DOC, JSON, or TXT files only.",
        },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upload file to Vercel Blob
    let blob;
    try {
      const fileName = `${userId}-${Date.now()}-${file.name}`;
      blob = await put(fileName, file, {
        access: "public",
      });
    } catch (blobError) {
      console.error("Blob upload error:", blobError);
      return NextResponse.json(
        {
          error: "Failed to upload file to storage",
        },
        { status: 500 }
      );
    }

    // Parse resume content using Gemini API via /api/ai
    let parsedData;
    try {
      // Prepare form data for /api/ai
      const aiFormData = new FormData();
      aiFormData.append("resume", file);
      // Call the local /api/ai endpoint
      const aiRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai`,
        {
          method: "POST",
          body: aiFormData,
        }
      );
      if (!aiRes.ok) {
        throw new Error("Failed to parse resume with Gemini API");
      }
      parsedData = await aiRes.json();
      console.log("parsedData", parsedData);
    } catch (parseError) {
      console.error("Parse error (Gemini):", parseError);
      // If parsing fails, create a basic structure

      parsedData = {
        name: user.name || "Unknown",
        email: user.email || "",
        phone: "",
        summary: "Please edit your profile to add a summary",
        skills: [],
        experience: [],
        education: [],
        projects: [],
        parseError:
          "Could not automatically parse resume content. Please review and edit manually.",
      };
    }

    console.log("parsedData", parsedData);
    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId,
        filename: file.name,
        originalUrl: blob.url,
        parsedData,
      },
    });

    return NextResponse.json({
      success: true,
      resume,
      message: "Resume uploaded and parsed successfully!",
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
