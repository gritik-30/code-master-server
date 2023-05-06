import mongoose from 'mongoose';

interface TestCase {
  inputs: string;
  expectedOutput: string;
  actualOutput: string;
  comparisionMethod: string;
}

interface Answer {
  question: mongoose.Types.ObjectId;
  isAnswered: boolean;
  candidateCode: string; 
  testCases: TestCase[];
}

export interface IResponse extends mongoose.Document {
  testId: String;
  candidateId: String;
  answers: Answer[];
  status: String;
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  totalPassed: number;
  score: number;
}

const TestCaseSchema = new mongoose.Schema({
  inputs: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  actualOutput: {
    type: String,
    required: false
  },
  comparisionMethod: {
    type: String,
    required: true,
  },
});

const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  candidateCode: {
    type: String,
    required: false
  },
  isAnswered: {
    type: Boolean,
    required: true
  }
});

const ResponseSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true,
  },
  candidateId: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    ref: 'Candidate',
    required: true,
  },
  status: {
    type: String,
    required: true
  },
  answers: {
    type: [AnswerSchema],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: false,
  },
  totalDuration: {
    type: Number,
    required: false,
  },
  totalPassed: {
    type: Number,
    required: false,
  },
  score: {
    type: Number,
    required: false,
  },
});

const CandidateResponse = mongoose.model<IResponse>('Response', ResponseSchema);

export default CandidateResponse;
