import mongoose, { Schema } from 'mongoose';
import urlNormalizer from "../libs/urlNormalizer";

export const modelName = 'Queue';

const schema = new Schema({
  url: {
    type: String,
    set: url => urlNormalizer(url),
    unique: true
  },
}, { timestamps: true });

export default mongoose.model(modelName, schema);