import { Router } from 'express';
import teacherController from '../controllers/teacher.controller';
import teacherMiddleware from '../middlewares/teacher.middleware';

const teacherRouter = Router();

teacherRouter.get('/:token',teacherController.getProfile);
teacherRouter.post('/register', teacherMiddleware.register ,teacherController.register);
teacherRouter.post('/login', teacherController.login);

export default teacherRouter;