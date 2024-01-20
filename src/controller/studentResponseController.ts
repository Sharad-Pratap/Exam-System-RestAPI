
// Student start an exam
import { Request, Response } from "express";
import Exam from "../db/examModel";
import StudentResponse from "../db/studentResponse";
import { jwtDecode } from "jwt-decode";

interface Token {
  userId: string;
  iat: number;
  exp: number;
  token: string;
}

export const startExam = async (req: Request, res: Response) => {
  try {
    const { examId } = req.body;

    // Find the exam by ID
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const token = req.cookies.accessToken;
    const decodedToken = jwtDecode<Token>(token);

    const _id = decodedToken.userId;

    // Check if the user already has a response for this exam
    const existingResponse = await StudentResponse.findOne({
      studentId: _id,
      examId,
    });

    if (existingResponse) {
      // Calculate the remaining time if the student has started the exam
      if (existingResponse.startTime) {
        const now = new Date();
        const examDuration = exam.durationMinutes;
        const elapsedTimeInSeconds =
          (now.getTime() - existingResponse.startTime.getTime()) / 1000;
        const remainingTimeInSeconds = Math.max(
          examDuration * 60 - elapsedTimeInSeconds,
          0
        );

        // Convert remaining time to minutes (optional)
        const remainingTimeInMinutes = Math.ceil(
          remainingTimeInSeconds / 60
        );

        return res.status(200).json({
          message: "Exam already started Againß",
          remainingTime: remainingTimeInMinutes,
        });
      }

      // If the student has not started the exam, return the existing start time
      return res
        .status(200)
        .json({ message: "Exam already started", startTime: existingResponse.startTime });
    }

    // Save the student response in the database and start the exam
    const startTime = new Date();

    const studentResponseData = new StudentResponse({
      studentId: _id,
      examId,
      startTime,
    });

    await studentResponseData.save();

    return res.status(200).json({ message: "Exam started", startTime });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
