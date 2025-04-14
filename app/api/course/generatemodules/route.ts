import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH } from "@/utils/auth";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const session = await getServerSession(NEXT_AUTH);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, moduleIds } = await req.json();
    // console.log("Received Prompt:", { prompt, moduleIds });
    
    if (!prompt || !moduleIds) {
      return NextResponse.json(
        { error: "Prompt and module IDs are required" },
        { status: 400 }
      );
    }

    const generationPrompt = `
    Generate exactly 5 educational content sections for a course module. Follow these rules STRICTLY:
    
    1. Each section MUST have:
       - "id": Use the provided module IDs: ${JSON.stringify(moduleIds)}
       - "title": 3-5 word title
       - "content": Under 50 words
    
    2. Return ONLY pure JSON (no markdown, no explanations)
    
    3. Example format:
    [
      {
        "id": "provided-module-id-1",
        "title": "Section Title",
        "content": "Brief content..."
      }
    ]
    
    Topic: ${prompt}
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: generationPrompt,
    });

    const responseText = result.text;
    console.log("Raw AI Response:", responseText);

   
    let generatedSections;
    try {
    
      let jsonString = responseText ? responseText.trim() : "";
      
      
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.slice(7).trim();
      } 
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.slice(3).trim();
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.slice(0, -3).trim();
      }

      
      generatedSections = JSON.parse(jsonString);

    
      if (!Array.isArray(generatedSections)) {
        throw new Error("AI response is not an array");
      }

      generatedSections.forEach((section: any, index: number) => {
        if (!section.id || !section.title || !section.content) {
          throw new Error(`Section ${index} is missing required fields`);
        }
        
        const wordCount = section.content.split(/\s+/).length;
        if (wordCount > 50) {
          throw new Error(`Section ${index} exceeds 50 words (${wordCount})`);
        }
      });

    } catch (e) {
      console.error("Error parsing AI response:", {
        error: e,
        rawResponse: responseText
      });
      throw new Error(`Failed to parse AI response: ${e instanceof Error ? e.message : String(e)}`);
    }

    return NextResponse.json({ 
      success: true,
      sections: generatedSections,
      model: "gemini-1.5-flash"
    });

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Content generation failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}