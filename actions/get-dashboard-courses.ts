import { Purchase, IPurchase } from "@/mongodb/Purchase";
import { Course, ICourse } from "@/mongodb/Course";
import { IChapter } from "@/mongodb/Chapter";
import { getProgress } from "@/actions/get-progress";
import { ICategory } from "@/mongodb/Category";

type CourseWithProgressWithCategory = ICourse & {
  category: ICategory;
  chapters: IChapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    // Find all purchases for the user
    const purchases = await Purchase.find({ userId }).lean();

    // Get the course IDs from the purchases
    const courseIds = purchases.map((purchase) => purchase.courseId);

    // Fetch the courses with their categories and chapters
    const courses = (await Course.find({ _id: { $in: courseIds } })
      .populate("categoryId")
      .populate({
        path: "chapters",
        match: { isPublished: true },
      })
      .lean()) as (ICourse & { _id: { toString(): string } })[];

    // Calculate progress for each course
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await getProgress(userId, course._id.toString());
        return { ...course, progress };
      })
    );

    // Separate completed courses from courses in progress
    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress === 100
    ) as CourseWithProgressWithCategory[];

    const coursesInProgress = coursesWithProgress.filter(
      (course) => (course.progress ?? 0) < 100
    ) as CourseWithProgressWithCategory[];

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
