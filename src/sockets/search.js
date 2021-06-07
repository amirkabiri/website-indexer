import tokenizer from "../libs/tokenizer";
import stemmer from '../libs/stemmer'
import Term from '../models/term'
import Page from '../models/page'
import rankingFunction from "../libs/rankingFunction";
import { trie } from "../web";

export const ROUTE = 'search';

export default socket => async (target, emit) => {
  const pagesCount = await Page.countDocuments();
  let averagePageLength = (await Page.aggregate([
    { $group: { _id: "", length: {$avg : "$length" }} }
  ]));
  averagePageLength = averagePageLength.length ? averagePageLength[0].length : 0;

  // calculating query terms and frequencies
  let query = {};
  for(const value of stemmer(tokenizer(target))){
    query[value] = (value in query ? query[value] : 0) + 1;
  }

  // loading terms from db
  const terms = {};
  for(const value in query){
    // const term = await Term.findOne({ value });
    const id = trie.searchTermID(value);
    if(id === null) continue;
    const term = await Term.findById(id);
    if(term){
      terms[value] = term;
    }
  }

  // remove terms which don't exists in db from query
  for(const value in query){
    if(terms[value] === undefined){
      delete query[value];
    }
  }

  // calculation document vectors (pagesTermsTable object)
  const pagesTermsTable = {};
  for(const term of Object.values(terms)){
    for(const page of term.pages){
       if(pagesTermsTable[page._id] === undefined){
         pagesTermsTable[page._id] = {};
       }

      pagesTermsTable[page._id][term.value] = page.frequency;
    }
  }

  // loading pages
  const pages = {};
  for(const pageID in pagesTermsTable){
    pages[pageID] = await Page.findById(pageID);
  }

  // ranking the pages
  const ranks = [];
  for(const pageID in pagesTermsTable){
    const page = pagesTermsTable[pageID];
    ranks.push({
      page: pageID,
      score: rankingFunction({
        queryVector: query,
        pageVector: page,
        averagePageLength,
        pageID,
        pagesCount,
        terms,
        pagesTermsTable,
        pages
      })
    });
  }

  // cutting 10 top pages
  const topPages = ranks.sort((a, b) => b.score - a.score).slice(0, Math.min(10, ranks.length));
  const scoresSum = topPages.reduce((sum, { score }) => sum + score, 0);

  // pages and loading them from DB
  const result = await Promise.all(
    topPages.map(async ({ page, score }) => ({
      ...(await Page.findById(page)).toObject(),
      score: ((score / scoresSum) * 100).toFixed(2)
    }))
  );

  emit(result)
}