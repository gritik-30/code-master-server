import mongoose from 'mongoose';

interface TestCase {
  inputs: string;
  expectedOutput: string;
  actualOutput: string;
}

interface Answer {
  question: mongoose.Types.ObjectId;
  isAnswered: boolean;
  status: string;
  candidateCode: string; 
  testCases: TestCase[];
}

export interface IResponse extends mongoose.Document {
  test: String;
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
  }
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
  },
  status: {
    type: String,
    require: false
  }
});

const ResponseSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Test'
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  status: {
    type: String,
    required: false
  },
  answers: {
    type: [AnswerSchema],
    required: true,
  },
  startTime: {
    type: Date,
    required: false,
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
