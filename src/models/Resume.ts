import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  posterId: mongoose.Types.ObjectId;
  format: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    posterId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    format: { type: String, required: true },
    url: { type: String, required: true }, // This will store the S3 URL
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);
