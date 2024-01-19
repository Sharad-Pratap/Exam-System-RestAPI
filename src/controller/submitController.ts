// Student submits an exam
import { Request, Response } from "express";
import Exam from "../db/examModel";
import { calculateResult } from "./calculateResult";
import StudentResponse, { IStudentResponse } from "../db/studentResponse";
import { jwtDecode } from "jwt-decode";

interface Token {
  userId: string;
  iat: number;
  exp: number;
  token: string;
}

export const submit = async (req: Request, res: Response) => {
  try {
    const { examId, studentResponses } = req.body;

    // Find the exam by ID
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const token = req.cookies.accessToken;
    const decodedToken = jwtDecode<Token>(token);
    const _id = decodedToken.userId;

    // Save the student responses in the database
    const studentResponseData = new StudentResponse({
      studentId: _id, // Replace with the actual student ID
      examId,
      responses: studentResponses,
      startTime: new Date(),
    });

    await studentResponseData.save();
    const user = await StudentResponse.findOne({ _id });
    // const cuurentexam = await Exam.findOne({examId})
    const startTime: Date | undefined = user?.startTime;
    const now = new Date();
    const examDuration = exam.durationMinutes;
    const elapsedTimeInSeconds = (now.getTime() - startTime!.getTime()) / 1000;
    const remainingTimeInSeconds = Math.max(
      examDuration * 60 - elapsedTimeInSeconds,
      0
    );

    // Convert remaining time to minutes (optional)
    const remainingTimeInMinutes = Math.ceil(remainingTimeInSeconds / 60);

    const updatedStudentResponseData = await StudentResponse.updateOne({_id : _id} , {$set : {startTime : remainingTimeInMinutes}});
    


    // // Calculate the result using the examController
    // const result = await calculateResult(exam, studentResponses);

    

    // You can save the result in the database if needed
    // For simplicity, we'll just return the result in the response
    return res.status(200).json({  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



