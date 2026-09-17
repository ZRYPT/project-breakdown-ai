import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export async function GET() {
  return NextResponse.json({ message: "API route is working!" });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not defined in .env.local" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const body = await request.json();
    const { project } = body;

    if (!project) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze this project idea: ${project}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            systems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  components: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        technologies: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        steps: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              title: { type: Type.STRING },
                              explanation: { type: Type.STRING },
                              code: { type: Type.STRING },
                            },
                            required: ["title", "explanation"],
                          },
                        },
                      },
                      required: ["name", "explanation", "technologies", "steps"],
                    },
                  },
                },
                required: ["name", "description", "components"],
              },
            },
          },
          required: ["name", "description", "systems"],
        },
      },
    });

    const projectData = JSON.parse(response.text || "{}");

    return NextResponse.json({
      success: true,
      data: projectData,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate project structure" },
      { status: 500 }
    );
  }
}