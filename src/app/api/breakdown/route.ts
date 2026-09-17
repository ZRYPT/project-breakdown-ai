import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const body = await request.json();
    const { componentName, action } = body;

    if (!componentName) {
      return NextResponse.json(
        { error: "Component name is required" },
        { status: 400 }
      );
    }

    let actionPrompt = "";
    if (action === "breakdown") {
      actionPrompt = `Break down the system component "${componentName}" into a list of smaller sub-components and nested subsystems.`;
    } else if (action === "explain") {
      actionPrompt = `Provide a detailed architectural explanation of how "${componentName}" works.`;
    } else if (action === "show_code") {
      actionPrompt = `Provide production-ready sample code and setup details for "${componentName}".`;
    } else if (action === "next_step") {
      actionPrompt = `Provide clear execution steps and implementation roadmap for building "${componentName}".`;
    } else {
      actionPrompt = `Explain and detail the component "${componentName}".`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: actionPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            details: { type: Type.STRING },
            subComponents: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            codeSnippet: { type: Type.STRING },
          },
          required: ["title", "details", "subComponents"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Breakdown API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate component breakdown" },
      { status: 500 }
    );
  }
}