import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserProgress } from "@/mongodb/UserProgress";


export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    } 

    const userProgress = await UserProgress.findOneAndUpdate(
      {
        userId,
        chapterId: params.chapterId,
      },
      {
        isCompleted,
        userId,
        chapterId: params.chapterId,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}