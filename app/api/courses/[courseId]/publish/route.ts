import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Types } from "mongoose"; // Import Types to handle ObjectId conversion

import { Course } from "@/mongodb/Course";
import { Chapter, IChapter } from "@/mongodb/Chapter";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the courseId is treated as a MongoDB ObjectId
    const courseId = new Types.ObjectId(params.courseId);

    // Find the course by userId and courseId
    const course = await Course.findOne({
      _id: courseId,
      userId,
    }).populate({
      path: "chapters",
      model: Chapter,
      select: "-__v", // Select all fields except __v
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Check if there is a published chapter
    const hasPublishedChapter = (course.chapters as unknown as IChapter[]).some(
      (chapter) => chapter.isPublished
    );

    // Check if all required fields are filled
    if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
      return new NextResponse("Missing required fields", { status: 401 });
    }
    console.log("course", course);
    // Update the course's `isPublished` field to true
    const publishedCourse = await Course.findOneAndUpdate(
      {
        _id: courseId,
        userId,
      },
      {
        isPublished: true,
      },
      { new: true } // Return the updated course
    );

    // If the update didn't succeed, return a failure response
    if (!publishedCourse) {
      return new NextResponse("Update failed", { status: 500 });
    }

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
