import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Course } from "@/mongodb/Course"; // Import your Mongoose Course model
import mongoose from 'mongoose'; // For ObjectId handling

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course by its id and userId
    const course = await Course.findOne({
      _id: new mongoose.Types.ObjectId(params.courseId),
      userId: userId,
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the course to mark it as unpublished
    const unpublishedCourse = await Course.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(params.courseId), userId: userId },
      { $set: { isPublished: false } },
      { new: true } // Return the updated document
    );

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
