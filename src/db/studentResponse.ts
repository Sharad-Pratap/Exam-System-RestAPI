// src/db/studentResponseModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IExam } from './examModel';

export interface IOptionResponse extends Document {
  chosenOption: string; // Update the field name to represent the chosen option directly
}

const optionResponseSchema = new mongoose.Schema<IOptionResponse>({
  chosenOption: { type: String, required: true },
});

export interface IQuestionResponse extends Document {
  questionNumber: number; // Change to represent the question number directly
  options: IOptionResponse[];
}

const questionResponseSchema = new mongoose.Schema<IQuestionResponse>({
  questionNumber: { type: Number, required: true },
  options: [optionResponseSchema],
});

export interface IStudentResponse extends Document {
  studentId: string;
  examId: string;
  responses: IQuestionResponse[];
  startTime?: Date; // New field to track the start time

}

const studentResponseSchema = new mongoose.Schema<IStudentResponse>({
  studentId: { type: String, required: true },
  examId: { type: String, required: true },
  responses: [questionResponseSchema],
  startTime: { type: Date },
});

export default mongoose.model<IStudentResponse>('StudentResponse', studentResponseSchema);

