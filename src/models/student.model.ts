import { Schema, model, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  password: string;
  org: Types.ObjectId;
}

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    org: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
  },
  { timestamps: true }
);

export default model<IStudent>('Student', StudentSchema);
