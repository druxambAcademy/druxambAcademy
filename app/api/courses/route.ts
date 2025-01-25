import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isTeacher } from "@/lib/teacher";
import { Course } from "@/mongodb/Course";

export async function POST(
  req: Request,
) {
  try {
    const { userId, orgId } = auth();
    const { title } = await req.json();

    if (!userId || !isTeacher(orgId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

       // Create a new course using Mongoose
       const newCourse = new Course({
         userId,
         title,
       });
   
       // Save the course in the database
       await newCourse.save();

    return NextResponse.json(newCourse);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}