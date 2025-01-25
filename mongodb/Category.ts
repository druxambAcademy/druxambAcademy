import { Schema, model, models, Document, Model, Types } from 'mongoose';

// Define the interface for the Category document
export interface ICategory extends Document {
  name: string;
  courses: Types.ObjectId[]; // Array of strings representing Course IDs
}

// Define the Mongoose schema with TypeScript support
const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  courses: [{ type: Types.ObjectId, ref: 'Course' }] // Array of references to Course
},  { timestamps: true });

// Define and export the Category model with the interface
export const Category: Model<ICategory> = models.Category || model<ICategory>('Category', categorySchema);
