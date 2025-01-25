import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/courses-list";
import { getCourses } from "@/actions/get-courses";
import { Category } from "@/mongodb/Category";
import { Categories } from "./_components/categories";
import { connectToMongoDB } from "@/lib/db";
import { Chapter } from "@/mongodb/Chapter";
import { Attachment } from "@/mongodb/Attachment";
import { UserProgress } from "@/mongodb/UserProgress";
import { Purchase } from "@/mongodb/Purchase";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await Category.find({})
    .sort({ name: 1 }) // Sort in ascending order (1 for ascending, -1 for descending)
    .lean();

  const courses: any = await getCourses({
    userId,
    ...searchParams,
  });
  await Chapter.find({ userId }).sort({ createdAt: -1 }).lean();
  await Attachment.find({ userId }).sort({ createdAt: -1 }).lean();
  await UserProgress.find({ userId }).sort({ createdAt: -1 }).lean();
  await Purchase.find({ userId }).sort({ createdAt: -1 }).lean();

  const plainCategories = JSON.parse(JSON.stringify(categories));
  const plainCourses = JSON.parse(JSON.stringify(courses));

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories
          items={plainCategories} // Type assertion as a temporary fix
        />
        <CoursesList items={plainCourses} />
      </div>
    </>
  );
};

export default SearchPage;
