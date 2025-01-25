import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Course } from "@/mongodb/Course";
import { Chapter } from "@/mongodb/Chapter";


export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const ownCourse = await Course.findOne({
      _id: params.courseId,
      userId: userId
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Use Promise.all to update all chapters concurrently
    await Promise.all(list.map(async (item: { id: string, position: number }) => {
      await Chapter.findByIdAndUpdate(item.id, { position: item.position });
    }));

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}