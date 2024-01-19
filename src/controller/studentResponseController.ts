
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

export const studentResponse = async (req: Request, res: Response) => {
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

    const user = await StudentResponse.findOne({ studentId: _id });
    
    if (!user || !user.startTime) {
      return res.status(404).json({ message: "User or startTime not found" });
    }

    const startTime: Date = user.startTime;
    const now = new Date();
    const examDuration = exam.durationMinutes;
    const elapsedTimeInSeconds = (now.getTime() - startTime.getTime()) / 1000;
    const remainingTimeInSeconds = Math.max(
      examDuration * 60 - elapsedTimeInSeconds,
      0
    );

    // Convert remaining time to minutes (optional)
    const remainingTimeInMinutes = Math.ceil(remainingTimeInSeconds / 60);

    await StudentResponse.updateOne(
      { _id: _id },
      { $set: { startTime: remainingTimeInMinutes } }
    );
    const newUpdatedData : IStudentResponse | null = await StudentResponse.findOne({ studentId : _id });
// Check if newUpdatedData and startTime exist
if (!newUpdatedData || newUpdatedData.startTime === undefined) {
  return res.status(404).json({ message: "User or startTime not found" });
}

let newTime: Date = newUpdatedData.startTime;
let nowTime : Date = new Date();
// Return the response
return res.status(200).json({ message: "exam started", time: `${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
