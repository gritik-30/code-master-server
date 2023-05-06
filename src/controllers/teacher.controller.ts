import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import Teacher from '../models/teacher.model';
import organization from '../models/organization.model';

class TeacherController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, firstName, lastName, orgName, _orgId } = req.body;

      // Check if teacher already exists
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(409).json({ message: 'Teacher already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create organization
      let orgId = _orgId;
      if(!_orgId){
        const org = new organization({ name: orgName });
        orgId = await org.save();
      }

      // Create a new teacher
      const teacher = new Teacher({ name, email, password: hashedPassword, firstName, lastName, isAdmin: true, org: orgId });
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
      if (!passwordMatches) {
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

  async getProfile(req: Request, res: Response) {
    try {
      const token = req.params.token;
      const decoded = Object(jwt.verify(token, 'secret'));
      const _id = decoded.id;

      const teacher = (await Teacher.findById(_id)).toObject();
      delete teacher.password;

      res.status(200).send(teacher);
    } catch(err) {
      res.status(500).send(res);
      console.error(err);
    }
  }
}

export default new TeacherController();
