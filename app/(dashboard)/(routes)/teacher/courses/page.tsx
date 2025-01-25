import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Course } from "@/mongodb/Course";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await Course.find({ userId }).sort({ createdAt: -1 }).lean();

  const formattedCourses = courses.map((course) => ({
    ...JSON.parse(JSON.stringify(course)),
    id: course._id.toString(),
  }));

  return (
    <div className="p-6">
      <DataTable columns={columns} data={formattedCourses} />
    </div>
  );
};

export default CoursesPage;
