import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH } from "@/utils/auth";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    // Initialize Google GenAI client
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY // Make sure to add this to your .env
    });

    // Verify authentication
    const session = await getServerSession(NEXT_AUTH);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request
    const { description } = await req.json();
    
    if (!description) {
      return NextResponse.json(
        { error: "Course description is required" },
        { status: 400 }
      );
    }

    // Generate course modules using Gemini
    
    const prompt = `
    You are an expert teacher's assistant. Generate exactly 5 comprehensive module titles for a course based on the description.
    Return ONLY a numbered list (1-5) of module titles without any additional text or explanations.
    Format: 
    1. Module One Title
    2. Module Two Title
    3. Module Three Title
    4. Module Four Title
    5. Module Five Title

    Course description: ${description}
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    // Process the AI response
    const aiResponse = result.text;
    console.log("AI Response:", aiResponse);
    if (!aiResponse) {
      throw new Error("No response from AI model");
    }

    // Extract exactly 5 modules


    // Validate we got exactly 5 modules
    const modules = aiResponse.split("\n").filter((line) => line.trim()).slice(0, 5);

    return NextResponse.json({ 
      success: true,
      data: {
        modules,
        model: "gemini-1.5-flash"
      }
    });

  } catch (error) {
    console.error("Error generating course modules:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to generate course modules",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}