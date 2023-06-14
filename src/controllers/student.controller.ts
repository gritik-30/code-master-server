import { Request, Response } from 'express';
import Student from '../models/student.model';

class StudentController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            // Check if the student exists
            const student = await Student.findOne({ email });

            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            // Compare passwords
            if (student.password !== password) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            res.status(200).json({ candidateId: student._id });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export default StudentController;
