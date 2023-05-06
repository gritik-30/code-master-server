import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  phone: string;
}

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IStudent>('Student', StudentSchema);
