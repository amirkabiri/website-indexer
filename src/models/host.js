import mongoose, { Schema } from 'mongoose';

export const modelName = 'Host';

const schema = new Schema({
  host: {
    type: String
  },
  done: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model(modelName, schema);