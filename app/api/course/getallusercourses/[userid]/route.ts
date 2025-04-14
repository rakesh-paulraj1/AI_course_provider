import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/Prisma";
import { NEXT_AUTH } from "@/utils/auth";
import { getServerSession } from "next-auth/next";

export async function GET(req: NextRequest) {
  try {
 
    const session = await getServerSession(NEXT_AUTH);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; 

   
    const courses = await prisma.course.findMany({
      where: {
        authors: {
          some: {
            userId: userId, 
          },
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
       authors:{
        include:{
          user:true}}},
    });

   
    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { error: "No courses found for this user" },
        { status: 404 }
      );
    }

    
    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching user courses",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}