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
  tokensCount: Number,
  termsCount: Number,
  length: Number,
  host: {
    type: Schema.Types.ObjectId,
    ref: 'Host',
    required: true
  }
})

schema.plugin(autoIncrement.plugin, { model: modelName, field: 'id' });

export default mongoose.model(modelName, schema);