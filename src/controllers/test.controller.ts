import { Request, Response, response } from 'express';
import Test from '../models/test.model';
import CandidateResponse from '../models/response.model';
import Question from '../models/question.model';

class TestController {
    async getAllTests(req: Request, res: Response) {
        try {
            const tests = await Test.find().populate('questions');
            return res.status(200).json(tests);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getTestById(req: Request, res: Response) {
        try {
            const test = await Test.findById(req.params.id).populate('questions');
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }
            return res.status(200).json(test);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async createTest(req: Request, res: Response) {
        try {
            const test = new Test({
                title: req.body.title,
                createdBy: req.body.createdBy,
                createdAt: new Date(),
                description: req.body.description,
                instructions: req.body.instructions,
                numberOfQuestions: req.body.questions.length,
                questions: req.body.questions,
                totalMarks: req.body.totalMarks,
                passingMarks: req.body.passingMarks
            });

            await test.save();
            return res.status(201).json(test);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async updateTest(req: Request, res: Response) {
        try {
            const updatedTest = await Test.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedTest) {
                return res.status(404).json({ message: 'Test not found' });
            }
            return res.status(200).json(updatedTest);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async deleteTest(req: Request, res: Response) {
        try {
            const deletedTest = await Test.findByIdAndDelete(req.params.id);
            if (!deletedTest) {
                return res.status(404).json({ message: 'Test not found' });
            }
            return res.status(200).json({ message: 'Test deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async startTest(req: Request, res: Response) {
        try {
            const testId = req.params.id;
            const test = (await Test.findById(testId)).toObject();
            if (test) {
                
                const questions = test.questions;
                const _test = {
                    testId: testId,
                    candidateId: "John Doe",
                    status: "STARTED",
                    startTime: new Date(),
                    endTime: null,
                    totalDuration: null,
                    totalPassed: null,
                    score: null,
                    answers: []
                };
                
                questions.forEach((ques: any) => {
                    _test['answers'].push({
                        question: ques._id,
                        isAnswered: false,
                        candidateCode: null,
                    });
                });

                const started = await CandidateResponse.create(_test);
                
                return res.status(200).json({testId: started._id});
            }
            return res.status(500).json({message: "Something went wrong."});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Invalid Test."});
        }
    }

    async getTestDetails(req: Request, res: Response) {
        try {
            const testId = req.params.id;
            const test = await CandidateResponse.findById(testId);
            return res.status(200).json(test);
        } catch (error) {
            console.error(error);
        }
    }

    async getQuestion(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const question = (await Question.findById(id)).toObject();
            question.testCases.forEach((testCase: any) => {
                delete testCase.expectedOutput;
            });
            res.status(200).json(question);
        } catch (error) {
            console.error(error);
            response.status(500).json({message: "Error while fetching question."});
        }
    }
}

export default TestController;
