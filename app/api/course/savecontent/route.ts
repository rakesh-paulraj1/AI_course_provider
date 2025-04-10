// app/api/course/savecontent/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/Prisma";
export async function POST(req: NextRequest) {
  try {
    const { moduleId, content } = await req.json();
    
    if (!moduleId || !content) {
      return NextResponse.json(
        { error: "Module ID and content are required" },
        { status: 400 }
      );
    }

    // Update the module content
    const updated = await prisma.moduleContent.updateMany({
      where: { moduleId },
      data: { content }
    });

    

    // return NextResponse.json({ 
    //   success: true,
    //   message: "Content updated successfully"
    // });
    return NextResponse.json({ 
   
      message: "Content updated successfully"
    });


  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}