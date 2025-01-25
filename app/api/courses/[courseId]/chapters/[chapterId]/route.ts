import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Course } from "@/mongodb/Course";
import { Chapter } from "@/mongodb/Chapter";


export async function DELETE(
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
      userId,
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await Chapter.findOne({
      _id: params.chapterId,
      courseId: params.courseId,
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    

    const deletedChapter = await Chapter.findByIdAndDelete(params.chapterId);

    const publishedChaptersInCourse = await Chapter.find({
      courseId: params.courseId,
      isPublished: true,
    });

    if (!publishedChaptersInCourse.length) {
      await Course.findByIdAndUpdate(params.courseId, {
        isPublished: false,
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

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

    const chapter = await Chapter.findOneAndUpdate(
      {
        _id: params.chapterId,
        courseId: params.courseId,
      },
      {
        ...values,
      },
      { new: true }
    );

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}