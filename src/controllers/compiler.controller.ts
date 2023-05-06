import { Request, Response } from 'express';
import Question from '../models/question.model';
import CompilerService from '../services/compiler.service';

class CompilerController {
    async runTest(req: Request, res: Response) {
        try {
            const compilerService = new CompilerService();
            const responseId = req.params.test;
            const questionId = req.params.id;
            const { code } = req.body;

            const question = (await Question.findById(questionId)).toObject();
            compilerService.testOutput(question.testCases, code);
            return res.status(200).json({});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
}

export default CompilerController;