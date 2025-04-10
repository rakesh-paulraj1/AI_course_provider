import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH } from "@/utils/auth";
import prisma from "@/utils/Prisma";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(NEXT_AUTH);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { title, description, modules } = await req.json();
    
    // Validate required fields
    if (!title || !description || !modules?.length) {
      return NextResponse.json(
        { error: "Title, description, and at least one module are required" },
        { status: 400 }
      );
    }

    // 1. Create the course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // 2. Create course author relationship
    await prisma.courseAuthor.create({
      data: {
        courseId: course.id,
        userId: session.user.id,
        role: "primary",
        joinedAt: new Date(),
      }
    });

    // 3. Create modules with empty content
    const createdModules = [];
    for (const [index, moduleTitle] of modules.entries()) {
      await prisma.module.create({
        data: {
          courseId: course.id,
          title: moduleTitle,
          description: "",
          position: index + 1,
          isLocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          contents: {
            create: {
              title: "Untitled Content",
              content: "",
              contentType: "text",
              position: 1,
              creatorId: session.user.id,
              aiGenerated: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          }
        },
        include: {
          contents: true
        }
      });
      createdModules.push(module);
    }

    return NextResponse.json(
      { 
        success: true,
        courseId: course.id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { 
        error: "An error occurred while creating the course",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}