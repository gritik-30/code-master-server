import mongoose from 'mongoose';

export interface TestCase {
  input: any[];
  expectedOutput: any;
}

export interface Question extends mongoose.Document {
  questionText: string;
  marks: number;
  language: string;
  sourceCode: string;
  template: string;
  testCases: TestCase[];
}

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true
  },
  language: {
    type:String,
    required: true
  },
  sourceCode: {
    type: String,
    required: true
  },
  template: {
    type: String,
    required: true
  },
  testCases: [
    {
      input: {
        type: String,
        required: true,
      },
      expectedOutput: {
        type: String,
        required: true,
      }
    },
  ]
});

const Question = mongoose.model<Question>('Question', QuestionSchema);

export default Question;