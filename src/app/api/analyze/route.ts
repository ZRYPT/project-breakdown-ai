import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { ProjectBreakdown } from "@/types/project";

export async function GET() {
  return NextResponse.json({ message: "API route is working!" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project } = body;

    if (!project) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Analyzing project: ${project}`,
      promptLoaded: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 500 }
    );
  }
}