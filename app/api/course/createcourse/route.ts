import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH } from "@/utils/auth";
import prisma from "@/utils/Prisma";

export async function POST(req: NextRequest) {
  try {
    
    const session = await getServerSession(NEXT_AUTH);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

   console.log("Session:", session.user);
    const { title, modules } = await req.json();
    
    if (!title || !modules?.length) {
      return NextResponse.json(
        { error: "Title, description, and at least one module are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    await prisma.courseAuthor.create({
      data: {
        courseId: course.id,
        userId: session.user.id,
        role: "primary",
        joinedAt: new Date(),
      }
    });

    const createdModules = [];
    for (const [index, moduleTitle] of modules.entries()) {
      await prisma.module.create({
        data: {
          courseId: course.id,
          title: moduleTitle,
          position: index + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        contents: {
          create: Array.from({ length: 5 }, () => ({
            title: "Untitled Content",
            content: "",
            createdAt: new Date(),
            creator: {
              connect: {
                id: session.user.id,
              },
            },
          }))
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
        createdModules: createdModules,
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