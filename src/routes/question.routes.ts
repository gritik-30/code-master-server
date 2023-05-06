import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';

const questionRouter = express.Router();

questionRouter.route('')
    .get(QuestionController.getQuestions)
    .post(QuestionController.createQuestion);

    questionRouter.route('/:id')
    .get(QuestionController.getQuestionById)
    .patch(QuestionController.updateQuestion)
    .delete(QuestionController.deleteQuestion);

export default questionRouter;
