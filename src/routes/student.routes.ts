import { Router } from 'express';
import StudentController from '../controllers/student.controller';

const studentController = new StudentController();
const studentRouter = Router();

studentRouter.post('/login', studentController.login);

export default studentRouter;
