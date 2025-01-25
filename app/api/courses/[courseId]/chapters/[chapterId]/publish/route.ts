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

    const chapter = await Chapter.findOne({
      _id: params.chapterId,
      courseId: params.courseId,
    });


    if (!chapter  || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedChapter = await Chapter.findOneAndUpdate(
      {
        _id: params.chapterId,
        courseId: params.courseId,
      },
      {
        isPublished: true,
      },
      { new: true }
    );

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}