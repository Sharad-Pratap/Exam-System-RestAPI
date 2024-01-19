// src/models/User.ts
import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role: 'student' | 'examiner';
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email : {type: String, required : true},
  role: { type: String, enum: ['student', 'examiner'], required: true },
});

export default mongoose.model<IUser>('User', userSchema);
