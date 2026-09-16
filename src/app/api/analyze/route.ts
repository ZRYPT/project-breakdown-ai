import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { platform } = await req.json();

    if (!platform) {
      return Response.json(
        { error: "Platform name is required" },
        { status: 400 }
      );
    }

    const prompt = `Provide a full system architecture breakdown for the existing platform: "${platform}". 
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
Include between 4 to 6 main core systems that power this platform.`;

    const { text } = await generateText({
      model: google("gemini-3.8-flash"),
      prompt,
    });

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return Response.json(data);
  } catch (error) {
    console.error("Error generating breakdown:", error);
    return Response.json(
      { error: "Failed to generate breakdown" },
      { status: 500 }
    );
  }
}