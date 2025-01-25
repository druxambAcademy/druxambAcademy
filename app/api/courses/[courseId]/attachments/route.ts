import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Course } from "@/mongodb/Course";
import { Attachment } from "@/mongodb/Attachment";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the course exists and is owned by the user
    const courseOwner = await Course.findOne({
      _id: new mongoose.Types.ObjectId(params.courseId),
      userId: userId,
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create the attachment
    const attachment = await Attachment.create({
      url,
      name: url.split("/").pop(), // Use the last part of the URL as the name
      courseId: new mongoose.Types.ObjectId(params.courseId),
    });

    // Update the course to include the new attachment
    await Course.updateOne(
      { _id: new mongoose.Types.ObjectId(params.courseId) },
      { $push: { attachments: attachment._id } } // Add the attachment's ObjectId to the course
    );

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
