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

    const prompt = `Provide a clear structural explanation for the component "${componentName}". Detail what it is, why it is needed, the step-by-step workflow, difficulty level, and key prerequisites.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
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
          required: [
            "title",
            "whatIsIt",
            "whyDoWeNeedIt",
            "howDoesItWork",
            "difficulty",
            "prerequisites",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Explanation API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate explanation" },
      { status: 500 }
    );
  }
}