import { getProgress } from "@/actions/get-progress";
import { Course } from "@/mongodb/Course";

type CourseWithProgressWithCategory = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  isPublished: boolean;
  category: { id: string; name: string } | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    // Query courses from MongoDB
    const courses = await Course.find({
      isPublished: true,
      ...(title ? { title: { $regex: title, $options: "i" } } : {}),
      ...(categoryId ? { categoryId } : {}),
    })
      .populate("categoryId", "name") // Populate category by categoryId
      .populate({
        path: "chapters",
        match: { isPublished: true }, // Only include published chapters
        select: "id", // Only select the 'id' field for chapters
      })
      .populate({
        path: "purchases",
        match: { userId }, // Only include purchases by the current user
      })
      .sort({ createdAt: -1 }) // Sort by creation date, descending
      .lean(); // Use lean() for performance as we don’t need the Mongoose document

    // Calculate progress for each course
    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course: any) => {
          const progress =
            !course.purchases || course.purchases.length === 0
              ? null
              : await getProgress(userId, course._id);

          return {
            _id: course._id,
            title: course.title,
            description: course.description,
            imageUrl: course.imageUrl,
            price: course.price,
            isPublished: course.isPublished,
            category:
              course.categoryId &&
              typeof course.categoryId === "object" &&
              "name" in course.categoryId
                ? {
                    id: (course.categoryId as any)._id,
                    name: (course.categoryId as any).name,
                  }
                : null,
            chapters: course.chapters.map((chapter: { _id: string }) => ({
              _id: chapter._id,
            })),
            progress,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
