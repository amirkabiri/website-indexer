import mongoose, { Schema } from 'mongoose';
import urlNormalizer from "../libs/urlNormalizer";
import autoIncrement from 'mongoose-auto-increment';

export const modelName = 'Page';

const schema = new Schema({
  url: {
    type: String,
    set: url => urlNormalizer(url),
    unique: true
  },
  tokensCount: { type: Number, default: 0 },
  termsCount: { type: Number, default: 0 },
  length: { type: Number, default: 0 },
  hash: String,
  host: { type: Schema.Types.ObjectId, ref: 'Host' },
  meta: {
    title: { type: String,  default: '' },
    description: { type: String,  default: '' },
    keywords: { type: String,  default: '' },
  }
})

schema.plugin(autoIncrement.plugin, { model: modelName, field: 'id' });

export default mongoose.model(modelName, schema);