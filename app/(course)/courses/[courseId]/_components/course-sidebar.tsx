import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ICourse } from "@/mongodb/Course";
import { Chapter, IChapter } from "@/mongodb/Chapter";
import { Purchase } from "@/mongodb/Purchase";
import { CourseProgress } from "@/components/course-progress";
import { UserProgress } from "@/mongodb/UserProgress";

import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
  course: ICourse & {
    chapters: IChapter[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await Purchase.findOne({
    userId,
    courseId: course._id,
  });

  // Fetch chapters and populate them with user progress
  const chapters = await Chapter.find({ courseId: course._id })
    .sort({ position: 1 })
    .lean();

  // Fetch user progress for each chapter
  const chaptersWithProgress = await Promise.all(chapters.map(async (chapter) => {
    const progress = await UserProgress.findOne({
      userId,
      chapterId: chapter._id
    });
    return {
      ...chapter,
      isCompleted: progress?.isCompleted || false
    };
  }));

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">
          {course.title}
        </h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {chaptersWithProgress.map((chapter) => (
          <CourseSidebarItem
            key={chapter._id.toString()}
            id={chapter._id.toString()}
            label={chapter.title}
            isCompleted={chapter.isCompleted}
            courseId={course._id as string}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}