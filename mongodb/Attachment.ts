import { Schema, model, models, Document, Model, Types } from 'mongoose';

// Define the interface for the Attachment document
export interface IAttachment extends Document {
  name: string;
  url: string;
  courseId: Types.ObjectId; // Reference to Course as ObjectId

}

// Define the Mongoose schema with TypeScript support
const attachmentSchema = new Schema<IAttachment>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to Course
  
},  { timestamps: true });

// Index on courseId for faster queries
attachmentSchema.index({ courseId: 1 });

// Define and export the Attachment model with the interface
export const Attachment: Model<IAttachment> = models.Attachment || model<IAttachment>('Attachment', attachmentSchema);
