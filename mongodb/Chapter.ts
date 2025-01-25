import { Schema, model, models, Document, Model, Types } from 'mongoose';

// Define the interface for the Chapter document
export interface IChapter extends Document {
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: Types.ObjectId; // Reference to Course as ObjectId
}

// Define the Mongoose schema with TypeScript support
const chapterSchema = new Schema<IChapter>({
  title: { type: String, required: true },
  description: { type: String, default: null },
  videoUrl: { type: String, default: null },
  position: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  isFree: { type: Boolean, default: false },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to Course
 
}, );

// Index on courseId for faster queries
chapterSchema.index({ courseId: 1 });

// Define and export the Chapter model with the interface
export const Chapter: Model<IChapter> = models.Chapter || model<IChapter>('Chapter', chapterSchema);
