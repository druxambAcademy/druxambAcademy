import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { Course } from "@/mongodb/Course"; // Mongoose Course model

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course and populate chapters and muxData
    const course = await Course.findOne({
      _id: params.courseId,
      userId: userId,
    }).populate({
      path: 'chapters',
      populate: {
        path: 'muxData', // Assuming muxData is a referenced model
      }
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

   

    // Delete the course
    const deletedCourse = await Course.deleteOne({
      _id: params.courseId,
      userId: userId,
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the course using Mongoose
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, userId: userId },
      { $set: values },
      { new: true } // Return the updated document
    );

    if (!updatedCourse) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
