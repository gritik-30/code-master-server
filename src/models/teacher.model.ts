import { Schema, model } from 'mongoose';

const teacherSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type: Boolean,
    required: false
  },
  org: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  }
});

export default model('Teacher', teacherSchema);
