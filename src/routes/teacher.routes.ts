import { Router } from 'express';
import teacherController from '../controllers/teacher.controller';
import teacherMiddleware from '../middlewares/teacher.middleware';

const teacherRouter = Router();

teacherRouter.post('/register', teacherMiddleware.register ,teacherController.register);
teacherRouter.post('/login', teacherController.login);
teacherRouter.get('/all-teachers',teacherController.getAllTeachers);
teacherRouter.get('/student/:orgId', teacherController.getAllStudents);
teacherRouter.post('/student', teacherController.registerStudent);
teacherRouter.get('/:token',teacherController.getProfile);

export default teacherRouter;