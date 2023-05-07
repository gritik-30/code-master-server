import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import Teacher from '../models/teacher.model';
import Student from '../models/student.model'
import organization from '../models/organization.model';

class TeacherController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, orgName, _orgId } = req.body;

      // Check if teacher already exists
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(409).json({ message: 'Teacher already exists' });
      }

      // Create organization
      let orgId = _orgId;
      let isAdmin = false;
      if(!_orgId){
        const org = new organization({ name: orgName });
        orgId = await org.save();
        isAdmin = true;
      }

      // Create a new teacher
      const teacher = new Teacher({ email, password, firstName, lastName, isAdmin: isAdmin, org: orgId });
      await teacher.save();

      res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Incorrect payload!' });
      }
      const { email, password } = req.body;

      // Check if teacher exists
      const teacher = await Teacher.findOne({ email });
      if (!teacher) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if password is correct
      const passwordMatches = await bcrypt.compare(password, teacher.password);
      if (password !== teacher.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign({ id: teacher._id }, 'secret', { expiresIn: '1d' });
      const message = "Login Successful!";

      res.json({ token, message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.error.message });
    }
  }

  async getAllTeachers(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      const decoded = Object(jwt.verify(token, 'secret'));
      const _id = decoded.id;

      const teacher = await Teacher.findById(_id).populate('org');
      const orgId = teacher.org._id;

      if(teacher.isAdmin) {
        const teachers = (await Teacher.find({ org: orgId, isAdmin: { $ne: true } }).populate('org'));
        res.status(200).send({teachers});
      } else {
        res.status(401).send({ message: 'Something went wrong!'});
      }
    } catch(err) {
      res.status(500).send({res});
      console.error(err);
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      const decoded = Object(jwt.verify(token, 'secret'));
      const _id = decoded.id;

      const teacher = (await Teacher.findById(_id).populate('org')).toObject();
      delete teacher.password;

      res.status(200).send(teacher);
    } catch(err) {
      res.status(500).send(res);
      console.error(err);
    }
  }

  async registerStudent(req: Request, res: Response) {
    try {
      const student = new Student({ ...req.body });
      const studentId = await student.save();

      res.status(200).send({ message: 'Student registered!'});
    } catch(err) {
      console.error(err);
      res.status(500).send({ message: 'Internal Server Error!'});
    }
  }

  async getAllStudents(req: Request, res: Response) {
    try {
      const orgId = req.params.orgId;
      const students = await Student.find({ org: orgId });
      res.status(200).send({ students: students});
    } catch(err) {
      console.error(err);
      res.status(500).send({ message: 'Internal Server Error!'});
    }
  }
}

export default new TeacherController();
