import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH } from "@/utils/auth";
import prisma from "@/utils/Prisma";

export async function GET(
  req: NextRequest,
  { params }: { params:Promise<{ courseid: string }> }
) {
  try {
   
    const session = await getServerSession(NEXT_AUTH);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseid } = await params;

    
    if (!courseid) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    
    const course = await prisma.course.findUnique({
      where: { id: courseid },
      include: {
        authors: true
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (course.authors.length === 0) {
      return NextResponse.json(
        { error: "Unauthorized access to course" },
        { status: 403 }
      );
    }

    
    const modules = await prisma.module.findMany({
      where: { courseId: courseid },
      select: {
        id: true,
        title: true,
        position: true,
        createdAt: true,
        contents: {
          select: {
            id: true,
            title: true,
          },
        }
      },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title,
        },
        modules
      }
    });

  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { 
        error: "An error occurred while fetching modules",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } 
}