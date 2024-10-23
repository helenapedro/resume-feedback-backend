import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } 
);

export default mongoose.model<IUser>('User', UserSchema);
