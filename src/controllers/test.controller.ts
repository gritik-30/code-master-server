import { Request, Response, response } from 'express';
import * as jwt from 'jsonwebtoken';
import Teacher from '../models/teacher.model';
import Test from '../models/test.model';
import CandidateResponse from '../models/response.model';
import Question from '../models/question.model';
import { ObjectId } from 'mongodb';

class TestController {
    async getAllTests(req: Request, res: Response) {
        try {
            const autToken = req.headers.authorization
            const decoded = Object(jwt.verify(autToken, 'secret'));
            const teacher = (await Teacher.findById(decoded.id)).toObject();
            let query = {};
            if (!teacher.isAdmin) {
                query = { createdBy: teacher._id };
            }
            const tests = await Test.find(query).populate('questions');
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
            const test = await CandidateResponse.findByIdAndUpdate(req.params.testId, {
                startTime: new Date(),
                status: "STARTED",
            })
            res.status(200).json({ ...test })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Invalid Test." });
        }
    }

    async generateResponse(req: Request, res: Response) {
        try {
            const testId = req.params.id;
            const test = (await Test.findById(testId)).toObject();
            if (test) {

                let questions = test.questions;
                const _test = {
                    test: testId,
                    candidate: req.body.studId,
                    status: null,
                    startTime: null,
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
                        status: null
                    });
                });

                const started = await CandidateResponse.create(_test);

                return res.status(200).json({ testId: started._id });
            }
            return res.status(500).json({ message: "Something went wrong." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Invalid Test." });
        }
    }

    async submitTest(req: Request, res: Response) {
        try {
            const testId = req.params.testId;
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(testId),
                    },
                },
                {
                    $unwind: "$answers",
                },
                {
                    $lookup: {
                        from: "questions",
                        // Replace "questions" with the actual collection name for questions
                        localField: "answers.question",
                        foreignField: "_id",
                        as: "answers.question",
                    },
                },
                {
                    $unwind: "$answers.question",
                },
                {
                    $match: {
                        "answers.status": "Passed",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalPassed: {
                            $sum: 1,
                        },
                        totalMarks: {
                            $sum: "$answers.question.marks",
                        },
                    },
                },
            ];
            const aggregateResult = await CandidateResponse.aggregate(pipeline);

            const test = await CandidateResponse.findById(testId).populate('test');
            const duration = test.startTime.getTime() - new Date().getTime();
            const status = test.test['passingMarks'] <= aggregateResult['totalMarks'] ? 'PASSED' : 'FAILED';

            const result = await CandidateResponse.findByIdAndUpdate(testId, { totalDuration: duration, endTime: new Date(), totalPassed: aggregateResult[0].totalPassed, score: aggregateResult[0].totalMarks, status: status }, { new: true }
            );
            res.status(200).json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err })
        }
    }

    async getTestDetails(req: Request, res: Response) {
        try {
            const testId = req.params.id;
            const test = (await CandidateResponse.findById(testId).populate('test').populate('answers.question'));
            return res.status(200).json(test);
        } catch (error) {
            console.error(error);
            res.status(500).json({error})
        }
    }

    async getTestResults(req: Request, res: Response) {
        try {
            const test = (await CandidateResponse.find().populate('test').populate('candidate'));
            return res.status(200).json(test);
        } catch (error) {
            console.error(error);
            res.status(500).json({error})
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
            response.status(500).json({ message: "Error while fetching question." });
        }
    }
}

export default TestController;
