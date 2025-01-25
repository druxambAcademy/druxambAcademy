import { Chapter } from "@/mongodb/Chapter"; // Mongoose Chapter model
import { UserProgress } from "@/mongodb/UserProgress"; // Mongoose UserProgress model
import mongoose from "mongoose"; // For ObjectId handling

// Function to find chapters for a specific course and user
const getChaptersForCourse = async (courseId: string) => {
  try {
    // Query to find chapters for the course and populate user progress
    const chapters = await Chapter.find({
      courseId: new mongoose.Types.ObjectId(courseId), // Filter chapters by courseId
      isPublished: true, // Optional: Only return published chapters
    })
    .populate({
      path: "userProgress", // Populate userProgress for each chapter

    })
    .lean(); // Use lean() for performance

    return chapters;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
};
export default getChaptersForCourse