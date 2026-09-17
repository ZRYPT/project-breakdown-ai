import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing in .env.local" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { componentName, action } = await request.json();

    // Branch logic based on button action type
    if (action === "show_code") {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Provide practical code implementation steps for the system component: "${componentName}". Show actual production-grade code snippets for each step.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    code: { type: Type.STRING },
                  },
                  required: ["stepNumber", "title", "explanation", "code"],
                },
              },
            },
            required: ["steps"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      return NextResponse.json({ success: true, data });
    } else {
      // Default: "explain", "breakdown", or "next_step"
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Provide a detailed explanation and breakdown for the system component: "${componentName}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              whatIsIt: { type: Type.STRING },
              whyDoWeNeedIt: { type: Type.STRING },
              howDoesItWork: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              difficulty: { type: Type.STRING },
              prerequisites: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["whatIsIt", "whyDoWeNeedIt", "howDoesItWork"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      return NextResponse.json({ success: true, data });
    }
  } catch (error: any) {
    console.error("Breakdown API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate breakdown" },
      { status: 500 }
    );
  }
}