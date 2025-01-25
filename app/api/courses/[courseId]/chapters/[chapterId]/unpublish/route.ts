import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Course } from "@/mongodb/Course";
import { Chapter } from "@/mongodb/Chapter";


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await Course.findOne({
      _id: params.courseId,
      userId
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedChapter = await Chapter.findOneAndUpdate(
      {
        _id: params.chapterId,
        courseId: params.courseId,
      },
      {
        isPublished: false,
      },
      { new: true }
    );

    const publishedChaptersInCourse = await Chapter.find({
      courseId: params.courseId,
      isPublished: true,
    });

    if (!publishedChaptersInCourse.length) {
      await Course.findByIdAndUpdate(params.courseId, {
        isPublished: false,
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}