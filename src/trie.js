require('./core/config');
console.log('Service: Trie');
console.log('Database:', process.env.DATABASE_URL)

const mongoose = require('./core/db').default();
const mongooseChunk = require('./libs/mongooseChunk').default;
const Term = require('./models/term').default;

// Term.aggregate([
//   { $project: { count: { $size:"$pages" }, value: 1 } },
//   { $match: { count: 1 } },
//   { $limit: 500 }
// ]).then(terms => {
//   for(const term of terms){
//     if(new RegExp('^[0-9]+$').test(term.value)){
//
//     }
//   }
// });

let i = 0;
mongooseChunk(5000, async function(terms){
  for(const term of terms){
    if(new RegExp('[0-9]').test(term.value) || new RegExp('_').test(term.value) || new RegExp('-').test(term.value) || term.value.substr(0, 2) === '0x') {
      await Term.deleteOne({ _id: term._id });
      i ++;
      console.log(term.value)
    }
  }
  console.log('hey')
}, Term, {}, 'value', { /*sort: { createdAt: -1 }*/ }).then(() => {
  console.log('removed : ', i )
})