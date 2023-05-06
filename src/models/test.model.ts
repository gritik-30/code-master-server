import { Schema, model, Document, Types } from 'mongoose';

interface Test extends Document {
  title: string;
  description: string;
  instructions: string;
  numberOfQuestions: Number;
  passingMarks: Number;
  totalMarks: Number;
  createdAt: Date;
  createdBy: Types.ObjectId;
  questions: Types.ObjectId[];
}

const TestSchema = new Schema<Test>({
  title: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  numberOfQuestions: {
    type: Number,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  }],
});

const Test = model<Test>('Test', TestSchema);

export default Test;
