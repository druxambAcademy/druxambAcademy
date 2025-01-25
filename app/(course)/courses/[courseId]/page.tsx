import { Course, ICourse } from "@/mongodb/Course";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {


  const course = await Course.findById(params.courseId)
    .populate({
      path: 'chapters',
      match: { isPublished: true },
      options: { sort: { position: 1 } }
    })
    .lean() as ICourse;

  if (!course) {
    return redirect("/");
  }

  if (!course.chapters || course.chapters.length === 0) {
    return redirect("/");
  }

  return redirect(`/courses/${course._id}/chapters/${course.chapters[0]._id}`);
}
 
export default CourseIdPage;