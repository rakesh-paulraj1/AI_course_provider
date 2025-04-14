import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/Prisma";
import { NEXT_AUTH } from "@/utils/auth";
import { getServerSession } from "next-auth/next";
export async function GET(
  req: NextRequest,
  { params }: { params:Promise< { moduleid: string }> }
) {
  try {
     const session = await getServerSession(NEXT_AUTH);
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    const { moduleid } =  await params;

    const moduleContents = await prisma.module.findUnique({
      where: { 
        id: moduleid
      },
      select: {
        title: true,
        contents: {
          select: {
            id: true,
            title: true,
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
        // moduleDescription: moduleContents.description,
        contents: moduleContents.contents.map(content => ({
          id: content.id,
          title: content.title,
          content: content.content,
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