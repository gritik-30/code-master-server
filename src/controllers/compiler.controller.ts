import { Request, Response } from 'express';
import CandidateResponse from '../models/response.model';

import * as request from 'request-promise-native';

class CompilerController {

    constructor() {
        this.runTest = this.runTest.bind(this);
    }

    async runTest(req: Request, res: Response) {
        try {
            const { responseId, question, code } = req.body;
            const sourceCode = code + question.question.sourceCode;
            const result = await this.testOutput(question.question.testCases, sourceCode);

            const status = result ? 'Passed' : 'Failed';
            const isAnswered = true;
            const response = await CandidateResponse.findOneAndUpdate(
                { _id: responseId, 'answers._id': question._id },
                { $set: { 'answers.$.status': status, 'answers.$.isAnswered': isAnswered, 'answers.$.candidateCode': code } },
                { new: true })
            return res.status(200).json({ ...response });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }

    async exec(sourceCode: string, input: string): Promise<string> {
        let res = '';
        const judgeRequestObject = {
            url: 'http://localhost:2358/submissions/?base64_encoded=true&wait=true',
            method: 'POST',
            headers: {
                'X-Auth-Token': 'mySecretToken',
                'X-Auth-User': 'ritikism',
                'Content-Type': 'application/json',
            },
            body: {
                source_code: Buffer.from(sourceCode).toString('base64'),
                language_id: 63,
                command_line_arguments: input,
                redirect_stderr_to_stdout: false,
            },
            json: true,
        };

        const judgeResponse = await request(judgeRequestObject);
        if (judgeResponse.status.description === 'Accepted') {
            res = judgeResponse.stdout;
        } else {
            res = judgeResponse.status.description;
        }
        return res;
    }

    async testOutput(testCases: any[], code: string) {
        let questionPassed = true;
        for (const testCase of testCases) {
            const actual = await this.exec(code, testCase.input);
            if (Buffer.from(actual, 'base64').toString('utf-8').trim() != testCase.expectedOutput) {
                questionPassed = false;
                break; // Break out of the loop
            }
        }
        return questionPassed;
    }
}

export default CompilerController;