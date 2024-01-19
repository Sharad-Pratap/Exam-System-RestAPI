// src/controllers/examController.ts
import Exam, { IExam, IQuestion } from '../db/examModel';

export const calculateResult = async (exam: IExam, studentResponses: { questionNumber: number, chosenOption: string }[]): Promise<number> => {
  try {
    let score = 0;

    // Fetch the correct answers for the exam
    const examWithQuestions: IExam | null = await Exam.findById(exam._id).populate('questions.options').lean().exec();
    
    if (!examWithQuestions) {
      throw new Error('Exam not found');
    }

    const questionsWithCorrectAnswers: IQuestion[] = examWithQuestions.questions;

    // Compare student responses with correct answers
    studentResponses.forEach(async (response) => {
      const question = questionsWithCorrectAnswers.find(q => q.questionNumber === response.questionNumber);

      if (question) {
        const correctOption = question.options.find(opt => opt.isCorrect && opt.letter === response.chosenOption);

        if (correctOption) {
          // Increment the score for correct answers
          score += 1;
        } else {
          // Deduct 1/4 for each wrong answer
          score -= 0.25;
        }
      }
    });

    // Ensure the score is not negative
    return Math.max(score, 0);
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};
