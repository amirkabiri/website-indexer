import { debounce } from 'lodash/function';
import TrieStructure from '../libs/TrieStructure';
import mongoose from 'mongoose';
import Term from '../models/term';
import mongooseChunk from '../libs/mongooseChunk';
import fs from 'fs';

let trie = new TrieStructure(), lastCount = 0, running = false;

const updateTrie = debounce(async () => {
  if(running) return;
  running = true;

  const count = await Term.countDocuments();
  if(count <= lastCount) {
    running = false;
    return;
  }
  let added = 0;
  lastCount = count;
  const startTime = Date.now();
  console.log(`Trie: started to update, terms: ${ count }`);

  await mongooseChunk(5000, function(terms){
    for(const term of terms){
      if(new RegExp('^[0-9]+$').test(term.value)) continue;

      added += 1;
      trie.insert(term.value, term._id);
    }
  }, Term, {}, 'value', { /*sort: { createdAt: -1 }*/ })

  running = false;
  fs.writeFileSync('trie.json', JSON.stringify(trie.tree));
  console.log(`Trie: ${ added } terms updated, time: ${ (Date.now() - startTime) / (1000 * 60) }m`);
}, 1000 * 60);

export function searchTermIDs(words){
  const terms = new Set;

  for(const word of words){
    const id = trie.find(word);
    if(id !== null) {
      terms.add(id);
    }
  }

  return [...terms];
}

export function searchTermID(term){
  const id = trie.find(term);
  return id;
}

export function searchPrefixWords(word){
  const node = trie.findNode(word);
}

mongoose.connection.once('open', async () => {
  try{
    if(fs.existsSync('trie.json')){
      const tree = fs.readFileSync('trie.json');
      trie.tree = JSON.parse(tree);
      console.log('Trie: loaded from file')
    }
  }catch (e){}

  // todo remove this return
  return;

  updateTrie();
  setInterval(updateTrie, 1000 * 60);
});