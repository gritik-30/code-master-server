import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || '';

export function connectToDatabase() {
  return mongoose.connect(MONGODB_URI)
}
