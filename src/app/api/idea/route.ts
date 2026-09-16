import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea) {
      return Response.json(
        { error: "Idea description is required" },
        { status: 400 }
      );
    }

    const prompt = `Provide a full project architecture breakdown for building this custom project idea: "${idea}". 
Return ONLY valid JSON matching this exact structure without markdown backticks or extra text:
{
  "systems": [
    {
      "name": "System/Module Name",
      "description": "Short explanation of what this module does.",
      "components": ["Component 1", "Component 2", "Component 3", "Component 4"]
    }
  ]
}
Include between 4 to 6 main core systems required to build this project from scratch.`;

    const { text } = await generateText({
      model: google("gemini-3.8-flash"),
      prompt,
    });

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return Response.json(data);
  } catch (error) {
    console.error("Error generating idea breakdown:", error);
    return Response.json(
      { error: "Failed to generate breakdown" },
      { status: 500 }
    );
  }
}