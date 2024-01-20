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
   


    // Calculate the result using the examController
    const result = await calculateResult(exam, studentResponses);

    

    // // You can save the result in t he database if needed
    // // For simplicity, we'll just return the result in the response
    return res.status(200).json({ message :"Based on Your responses you scored :", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



