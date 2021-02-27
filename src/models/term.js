import mongoose, { Schema } from 'mongoose';
import urlNormalizer from "../libs/urlNormalizer";
import autoIncrement from 'mongoose-auto-increment';

export const modelName = 'Term';

const schema = new Schema({
  value: { type: String, required: true, unique: true },
  pages: [{
    _id: { type: Schema.Types.ObjectId, ref: 'Page', required: true },
    id: { type: Number, required: true },
    frequency: { type: Number, default: 0 }
  }]
})

schema.plugin(autoIncrement.plugin, { model: modelName, field: 'id' });
const model = mongoose.model(modelName, schema);

if (!mongoose.models[modelName]['insertPage']) {
  mongoose.models[modelName].prototype['insertPage'] = function(page) {
    let i = 0;
    while(i < this.pages.length && this.pages[i].id < page.id) i ++;

    if(i < this.pages.length && this.pages[i].id === page.id){
      this.pages[i].frequency += page.frequency;
    } else{
      this.pages.splice(i, 0, page);
    }

    return this;
  }
}

export default model;