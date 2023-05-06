import { Request, Response } from 'express';
import Question, { Question as QuestionType } from '../models/question.model';

export class QuestionController {
  static async createQuestion(req: Request, res: Response) {
    try {
      const { questionText, marks, language, sourceCode, template, testCases } = req.body;

      const question: QuestionType = new Question({
        questionText,
        marks,
        language,
        sourceCode,
        template,
        testCases
      });

      await question.save();

      return res.status(201).json({
        message: 'Question created successfully',
        question
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Server error'
      });
    }
  }

  static async getQuestions(req: Request, res: Response) {
    try {
      const questions: QuestionType[] = await Question.find();

      return res.status(200).json({
        questions
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Server error'
      });
    }
  }

  static async getQuestionById(req: Request, res: Response) {
    try {
      const question: QuestionType | null = await Question.findById(req.params.id);

      if (!question) {
        return res.status(404).json({
          message: 'Question not found'
        });
      }

      return res.status(200).json({
        question
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Server error'
      });
    }
  }

  static async updateQuestion(req: Request, res: Response) {
    try {
      const question: QuestionType | null = await Question.findById(req.params.id);

      if (!question) {
        return res.status(404).json({
          message: 'Question not found'
        });
      }

      const { questionText, marks, testCases } = req.body;

      question.questionText = questionText;
      question.marks = marks;
      question.testCases = testCases;

      await question.save();

      return res.status(200).json({
        message: 'Question updated successfully',
        question
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Server error'
      });
    }
  }

  static async deleteQuestion(req: Request, res: Response) {
    try {
      const questionId = req.params.id;

      const deletedQuestion = await Question.deleteOne({ _id: questionId });

      if (deletedQuestion.deletedCount === 0) {
        return res.status(404).json({ message: 'Question not found' });
      }

      res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Server error'
      });
    }
  }
}
