import { Schema, model } from 'mongoose';

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  }
});

export default model('Organization', organizationSchema);
