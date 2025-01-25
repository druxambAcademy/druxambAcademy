import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { Course } from "@/mongodb/Course";
import { Attachment } from "@/mongodb/Attachment";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, attachmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await Course.findOne({
      _id: params.courseId,
      userId: userId
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await Attachment.findOneAndDelete({
      _id: params.attachmentId,
      courseId: params.courseId,
    });

    if (!attachment) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

