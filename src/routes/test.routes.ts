import { Router } from 'express';
import TestController from '../controllers/test.controller';
import CompilerController from '../controllers/compiler.controller';

const testController = new TestController();
const compiler = new CompilerController();
const testRouter = Router();

testRouter.route('')
    .get(testController.getAllTests)
    .post(testController.createTest);

testRouter.route('/:id')
    .get(testController.getTestById)
    .patch(testController.updateTest)
    .delete(testController.deleteTest);

testRouter.route('/start/:id')
    .post(testController.startTest);

testRouter.route('/test-details/:id')
    .get(testController.getTestDetails);

testRouter.route('/question/:test/:id')
    .get(testController.getQuestion)
    .post(compiler.runTest);

export default testRouter;