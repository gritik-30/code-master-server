import { Router } from 'express';
import TestController from '../controllers/test.controller';
import CompilerController from '../controllers/compiler.controller';

const testController = new TestController();
const compiler = new CompilerController();
const testRouter = Router();

testRouter.route('')
    .get(testController.getAllTests)
    .post(testController.createTest);

testRouter.route('/all-results').
    get(testController.getTestResults);

testRouter.route('/:id')
    .get(testController.getTestById)
    .patch(testController.updateTest)
    .delete(testController.deleteTest);

testRouter.route('/test-response/:id')
    .post(testController.generateResponse);

testRouter.route('/start/:testId')
    .patch(testController.startTest);

testRouter.route('/end/:testId')
    .patch(testController.submitTest);


testRouter.route('/test-details/:id')
    .get(testController.getTestDetails);

testRouter.route('/exec')
    .get(testController.getQuestion)
    .post(compiler.runTest);

export default testRouter;