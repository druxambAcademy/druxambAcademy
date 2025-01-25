import { Chapter } from "@/mongodb/Chapter";
import { UserProgress } from "@/mongodb/UserProgress";

export const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const publishedChapters = await Chapter.find({
      courseId: courseId,
      isPublished: true,
    }).select('_id');

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await UserProgress.countDocuments({
      userId: userId,
      chapterId: {
        $in: publishedChapterIds,
      },
      isCompleted: true,
    });

    const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
}
