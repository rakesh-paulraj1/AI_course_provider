// app/api/course/savecontent/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/Prisma";
export async function PUT(req: NextRequest) {
  try {
    const { contentId, content,title } = await req.json();
    console.log("Received data:", { contentId, content,title });
    if (!contentId || !content || !title) {
      return NextResponse.json(
        { error: "Module ID and content are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.moduleContent.updateMany({
      where: { id:contentId },
      data: { content,
        title
       }
    });

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