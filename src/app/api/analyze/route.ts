import { NextResponse } from "next/server";

// Handles browser requests (GET)
export async function GET() {
  return NextResponse.json({ message: "API route is working!" });
}

// Handles data submission (POST)
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
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 500 }
    );
  }
}