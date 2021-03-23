import mongoose, { Schema } from 'mongoose';
import urlNormalizer from "../libs/urlNormalizer";

export const modelName = 'Queue';

const schema = new Schema({
  url: {
    type: String,
    set: url => urlNormalizer(url),
    unique: true
  },
  priority: { type: Number, default: 0 },
  childPriority: { type: String, default: 'p => Math.max(0, p - 1)' },
  depth: { type: Number, default: -1 },
  payload: { type: String }
}, { timestamps: true });

export default mongoose.model(modelName, schema);