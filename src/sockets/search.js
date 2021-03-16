import tokenizer from "../libs/tokenizer";
import stemmer from '../libs/stemmer'
import Term from '../models/term'
import Page from '../models/page'
import rankingFunction from "../libs/rankingFunction";

export const ROUTE = 'search';

export default socket => async (target, emit) => {
  let query = {};
  const terms = {};
  const pages = {};
  const pagesCount = await Page.countDocuments();

  // calculating query terms and frequencies
  for(const value of stemmer(tokenizer(target))){
    query[value] = (value in query ? query[value] : 0) + 1;
  }

  // loading terms from db
  for(const value in query){
    const term = await Term.findOne({ value });
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

  // calculation document vectors (pages object)
  for(const term of Object.values(terms)){
    for(const page of term.pages){
       if(pages[page._id] === undefined){
         pages[page._id] = {};
       }

      pages[page._id][term.value] = page.frequency;
    }
  }

  // ranking the pages
  const ranks = [];
  for(const pageID in pages){
    const page = pages[pageID];
    ranks.push({
      page: pageID,
      score: rankingFunction({
        queryVector: query,
        pageVector: page,
        pageID,
        pagesCount,
        terms,
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