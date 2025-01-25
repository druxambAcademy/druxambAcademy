import { Schema,  Document, Types, Model, model, models } from 'mongoose';

// Define the interface for the UserProgress document
export interface IUserProgress extends Document {
  id: string;
  userId: string;
  chapterId: Types.ObjectId; // Reference to Chapter as ObjectId
  isCompleted: boolean;

}

// Define the Mongoose schema with TypeScript support
const userProgressSchema = new Schema<IUserProgress>({
  userId: { type: String, required: true },
  chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true }, // Reference to Chapter
  isCompleted: { type: Boolean, default: false },
 
},  { timestamps: true });

// Unique index on userId and chapterId to ensure each user can only have one progress entry per chapter
userProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

// Define and
export const UserProgress: Model<IUserProgress> = models.UserProgress || model<IUserProgress>('UserProgress', userProgressSchema);