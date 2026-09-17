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
      contents: `Analyze the following project idea and provide a comprehensive software architecture breakdown including UI tree structure, systems, components, educational metrics, development roadmap, technology recommendations, Supabase architecture, account workflow, and progress tracking checklist: "${project}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            uiLayout: {
              type: Type.OBJECT,
              properties: {
                treeTitle: { type: Type.STRING }, // e.g. "PROJECT TREE"
                systems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      components: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["name", "components"],
                  },
                },
              },
              required: ["treeTitle", "systems"],
            },
            progressTracking: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      completed: { type: Type.BOOLEAN },
                    },
                    required: ["title", "completed"],
                  },
                },
                platformFeel: { type: Type.STRING },
              },
              required: ["description", "tasks", "platformFeel"],
            },
            accountAndDashboard: {
              type: Type.OBJECT,
              properties: {
                flow: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                sampleProjects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      progress: { type: Type.STRING },
                    },
                    required: ["title", "progress"],
                  },
                },
              },
              required: ["flow", "sampleProjects"],
            },
            supabaseArchitecture: {
              type: Type.OBJECT,
              properties: {
                handledEntities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                suggestedTables: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                advice: { type: Type.STRING },
              },
              required: ["handledEntities", "suggestedTables", "advice"],
            },
            technologyRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  technology: { type: Type.STRING },
                  reason: { type: Type.STRING },
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
            "uiLayout",
            "progressTracking",
            "accountAndDashboard",
            "supabaseArchitecture",
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