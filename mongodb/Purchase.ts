import { Schema, model, models, Document, Model, Types } from "mongoose";

// Define the interface for the Purchase document
export interface IPurchase extends Document {
  userId: string;
  courseId: Types.ObjectId; // Reference to Course as ObjectId
}

// Define the Mongoose schema with TypeScript support
const purchaseSchema = new Schema<IPurchase>(
  {
    userId: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true }, // Reference to Course
  },
  { timestamps: true }
);

// Unique index on userId and courseId to prevent duplicate purchases
purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Check if the model already exists to prevent redefining it
export const Purchase: Model<IPurchase> =
  models.Purchase || model<IPurchase>("Purchase", purchaseSchema);
