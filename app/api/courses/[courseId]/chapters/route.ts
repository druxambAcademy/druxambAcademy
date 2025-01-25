import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Course } from "@/mongodb/Course"; // Mongoose Course model
import { Chapter } from "@/mongodb/Chapter"; // Mongoose Chapter model
import mongoose from 'mongoose'; // For ObjectId handling

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the course exists and is owned by the user
    const courseOwner = await Course.findOne({
      _id: new mongoose.Types.ObjectId(params.courseId),
      userId: userId,
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the last chapter by position
    const lastChapter = await Chapter.findOne({
      courseId: new mongoose.Types.ObjectId(params.courseId),
    }).sort({ position: "desc" });

    // Determine the new chapter's position
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Create a new chapter
    const chapter = await Chapter.create({
      title: title,
      courseId: new mongoose.Types.ObjectId(params.courseId),
      position: newPosition,
    });

    // Add the new chapter's ObjectId to the course's chapters array
    await Course.updateOne(
      { _id: new mongoose.Types.ObjectId(params.courseId) },
      { $push: { chapters: chapter._id } } // Push the new chapter's ObjectId
    );

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
