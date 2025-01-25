import { Schema, model, models, Document, Model, Types } from "mongoose";

// Define the interface for the Course document
export interface ICourse extends Document {
  title: string;
  userId: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  isPublished: boolean;
  categoryId: Types.ObjectId | null; // Reference to Category as ObjectId
  chapters: Types.ObjectId[]; // Array of ObjectIds referencing Chapter
  purchases: Types.ObjectId[]; // Array of ObjectIds referencing Purchase
  attachments: Types.ObjectId[]; // Array of ObjectIds referencing Attachment
}

// Define the Mongoose schema with TypeScript support
const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true },
    description: { type: String, default: null },
    imageUrl: { type: String, default: null },
    price: { type: Number, default: null },
    isPublished: { type: Boolean, default: false },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null }, // Reference to Category
    chapters: [{ type: Types.ObjectId, ref: "Chapter" }], // Reference to Chapter
    purchases: [{ type: Types.ObjectId, ref: "Purchase" }], // Reference to Purchase
    attachments: [{ type: Types.ObjectId, ref: "Attachment" }], // Reference to Attachment
  },
  { timestamps: true }
);

// Index on categoryId for faster queries
courseSchema.index({ categoryId: 1 });

// Define and export the Course model with the interface
export const Course: Model<ICourse> =
  models.Course || model<ICourse>("Course", courseSchema);
