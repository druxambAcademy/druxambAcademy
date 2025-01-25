import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Course } from "@/mongodb/Course"; // Import the Mongoose Course model
import { getProgress } from "@/actions/get-progress";

import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = (await Course.findById(params.courseId)
    .populate({
      path: "chapters",
      match: { isPublished: true },

      options: { sort: { position: 1 } },
    })
    .lean()) as any; // Add type assertion here

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, course._id);

  const plainCourse = JSON.parse(JSON.stringify(course));
  const plainProgressCount = JSON.parse(JSON.stringify(progressCount));

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={plainCourse} progressCount={plainProgressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={plainCourse}
          progressCount={plainProgressCount}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
