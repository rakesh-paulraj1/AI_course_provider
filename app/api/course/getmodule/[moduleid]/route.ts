import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/Prisma";
import { NEXT_AUTH } from "@/utils/auth";
import { getServerSession } from "next-auth/next";
export async function GET(
  req: NextRequest,
  { params }: { params: { moduleid: string } }
) {
  try {
     const session = await getServerSession(NEXT_AUTH);
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    const { moduleid } = params;

    // Get module with all contents (only title and content fields)
    const moduleContents = await prisma.module.findUnique({
      where: { 
        id: moduleid
      },
      select: {
        title: true, // Include module title
        description: true, // Include module description
        contents: {
         
          select: {
            content: true,
          }
        }
      }
    });

    if (!moduleContents) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }
   

    return NextResponse.json({
      success: true,
      data: {
        moduleTitle: moduleContents.title,
        moduleDescription: moduleContents.description,
        contents: moduleContents.contents.map(content => ({
          title: content.title,
          content: content.content,
          position: content.position,
          type: content.contentType,
          createdAt: content.createdAt
        }))
      }
    });

  } catch (error) {
    console.error("Error fetching module contents:", error);
    return NextResponse.json(
      { 
        error: "An error occurred while fetching module contents",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}