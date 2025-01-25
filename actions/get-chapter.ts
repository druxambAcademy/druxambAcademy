import { Purchase } from "@/mongodb/Purchase"; // Mongoose Purchase model
import { Course } from "@/mongodb/Course"; // Mongoose Course model
import { Chapter } from "@/mongodb/Chapter"; // Mongoose Chapter model
import { Attachment } from "@/mongodb/Attachment"; // Mongoose Attachment model
import { UserProgress } from "@/mongodb/UserProgress"; // Mongoose UserProgress model
import mongoose from 'mongoose';

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
};

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    // Check if the user has purchased the course
    const purchase = await Purchase.findOne({
      userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    }).lean();

    // Fetch the course details (including its price)
    const course = await Course.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
      isPublished: true,
    })
      .select('price')
      .lean();

    // Fetch the specific chapter
    const chapter = await Chapter.findOne({
      _id: new mongoose.Types.ObjectId(chapterId),
      isPublished: true,
    }).lean();

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let attachments: any[] = [];
    let nextChapter: any | null = null;

    // If the user purchased the course, fetch all the attachments
    if (purchase) {
      attachments = await Attachment.find({
        courseId: new mongoose.Types.ObjectId(courseId),
      }).lean();
    }

    // If the chapter is free or if the user purchased the course
    if (chapter.isFree || purchase) {
      // Fetch MuxData for the chapter
     
      // Fetch the next chapter based on its position
      nextChapter = await Chapter.findOne({
        courseId: new mongoose.Types.ObjectId(courseId),
        isPublished: true,
        position: { $gt: chapter.position },
      })
        .sort({ position: 'asc' })
        .lean();
    }

    // Fetch the user's progress on the chapter
    const userProgress = await UserProgress.findOne({
      userId,
      chapterId: new mongoose.Types.ObjectId(chapterId),
    }).lean();

    return {
      chapter,
      course,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
