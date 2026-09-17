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
    const { project } = await request.json();

    if (!project) {
      return NextResponse.json(
        { error: "Project description is required" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze the following project idea and provide a comprehensive software architecture breakdown including systems, components, educational metrics, a sequential development roadmap, and categorized technology recommendations with explanations: "${project}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            technologyRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING }, // e.g. "Frontend", "Backend", "Database"
                  technology: { type: Type.STRING }, // e.g. "Next.js"
                  reason: { type: Type.STRING }, // Why it is recommended
                },
                required: ["category", "technology", "reason"],
              },
            },
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
                        difficulty: { type: Type.STRING },
                        prerequisites: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        estimatedLearningTime: { type: Type.STRING },
                      },
                      required: [
                        "name",
                        "explanation",
                        "technologies",
                        "difficulty",
                        "prerequisites",
                        "estimatedLearningTime",
                      ],
                    },
                  },
                },
                required: ["name", "description", "components"],
              },
            },
            developmentRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["stepNumber", "title", "description"],
              },
            },
          },
          required: [
            "name",
            "description",
            "technologyRecommendations",
            "systems",
            "developmentRoadmap",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze project" },
      { status: 500 }
    );
  }
}