import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Course } from "@/mongodb/Course";
import { Purchase } from "@/mongodb/Purchase";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const alreadyPurchased = await Purchase.findOne({
      userId,
      courseId: course._id,
    });

    if (alreadyPurchased) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    // Create a new purchase
    const purchase = await Purchase.create({
      userId,
      courseId: course._id,
    });

    // Update the course with the new purchase ID
    await Course.findByIdAndUpdate(courseId, {
      $push: { purchases: purchase._id },
    });

    return NextResponse.json({ purchase });
  } catch (error) {
    console.error("[COURSE_PURCHASE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
