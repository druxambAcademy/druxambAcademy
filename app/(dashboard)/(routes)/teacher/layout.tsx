import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const TeacherLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { orgId } = auth();

  if (!isTeacher(orgId)) {
    return redirect("/");
  }

  return <>{children}</>
}
 
export default TeacherLayout;