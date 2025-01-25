
import { NavbarRoutes } from "@/components/navbar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { ICourse } from "@/mongodb/Course";
import { IChapter } from "@/mongodb/Chapter";
import { IUserProgress } from "@/mongodb/UserProgress";

interface CourseNavbarProps {
  course: ICourse & {
    chapters: (IChapter & {
      userProgress: IUserProgress[] | null;
    })[];
  };
  progressCount: number;
};

export const CourseNavbar = ({
  course,
  progressCount,
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes />      
    </div>
  )
}