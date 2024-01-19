// examinerRoutes.ts
import express, { Request, Response } from 'express';
import Exam, { IExam } from '../db/examModel';


// Examiner creates a new exam
export const setExam = async (req: Request, res: Response) => {
    try {
      const { title, durationMinutes, questionsData } = req.body;
  
      // Create the exam with questions and options directly
      const newExam: IExam = await Exam.create({
        title,
        durationMinutes,
        questions: questionsData,
      });
  
      return res.status(201).json(newExam);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  