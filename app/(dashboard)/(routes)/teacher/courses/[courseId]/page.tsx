import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { Types } from "mongoose";

import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { Course, ICourse } from "@/mongodb/Course";
import { Category } from "@/mongodb/Category";
import { IChapter } from "@/mongodb/Chapter";
import { Attachment, IAttachment } from "@/mongodb/Attachment"; // Update this import

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // Ensure Attachment model is registered before querying
  await Attachment.init();

  const course = await Course.findOne({
    _id: new Types.ObjectId(params.courseId),
    userId,
  })
    .populate([
      {
        path: "chapters",
        options: { sort: { position: 1 } },
      },
      { path: "attachments", options: { sort: { createdAt: -1 } } },
    ])
    .lean();

  const categories = await Category.find().sort({ name: 1 }).lean();

  if (!course) {
    return redirect("/");
  }

  const plainCourse = JSON.parse(JSON.stringify(course));
  const plainCategories = JSON.parse(JSON.stringify(categories));

  const requiredFields = [
    plainCourse.title,
    plainCourse.description,
    plainCourse.imageUrl,
    plainCourse.price,
    plainCourse.categoryId,
    plainCourse.chapters?.some((chapter: any) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={plainCourse} courseId={plainCourse._id} />
            <DescriptionForm
              initialData={plainCourse}
              courseId={plainCourse._id}
            />
            <ImageForm initialData={plainCourse} courseId={params.courseId} />
            <CategoryForm
              initialData={plainCourse}
              courseId={params.courseId}
              options={plainCategories.map(
                (category: { name: string; _id: string }) => ({
                  label: category.name,
                  value: category._id,
                })
              )}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm
                initialData={plainCourse}
                courseId={plainCourse._id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={plainCourse} courseId={plainCourse._id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm
                initialData={plainCourse}
                courseId={plainCourse._id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
