// src/models/Exam.ts
// import mongoose, { Document } from 'mongoose';
// import Question , {IQuestion} from '../db/questionModel'

// export interface IExam extends Document {
//   title: string;
//   durationMinutes: number;
//   questions: IQuestion[];
// }

// const examSchema = new mongoose.Schema<IExam>({
//   title: { type: String, required: true },
//   durationMinutes: { type: Number, required: true },
//   questions: [{Question}],
// });

// export default mongoose.model<IExam>('Exam', examSchema);
// src/db/examModel.ts

import mongoose, { Document } from 'mongoose';

export interface IOption extends Document {
    text: string;
    letter: string; // Add a field to represent the letter of the option (e.g., "A" or "B")
    isCorrect: boolean;
  }
  
  const optionSchema = new mongoose.Schema<IOption>({
    text: { type: String, required: true },
    letter: { type: String, required: true }, // Add this field
    isCorrect: { type: Boolean, required: true },
  });

export interface IQuestion extends Document {
  questionNumber: number;
  options: IOption[];
}

const questionSchema = new mongoose.Schema<IQuestion>({
  questionNumber: { type: Number, required: true },
  options: [optionSchema],
});

export interface IExam extends Document {
  title: string;
  durationMinutes: number;
  questions: IQuestion[];
}

const examSchema = new mongoose.Schema<IExam>({
  title: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  questions: [questionSchema],
});

const Exam = mongoose.model<IExam>('Exam', examSchema);

export default Exam;
