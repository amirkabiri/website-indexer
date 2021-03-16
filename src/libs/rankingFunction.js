const BM25_UPPER_BOUND = 20;

export default function rankingFunction({
  pageVector,
  queryVector,
  pagesCount,
  terms,
  pages,
  pageID
}){
  let score = 0;

  for(const queryTerm in queryVector){
    if(!queryVector.hasOwnProperty(queryTerm)) continue;

    for(const pageTerm in pageVector){
      if(!pageVector.hasOwnProperty(pageTerm)) continue;
      if(queryTerm !== pageTerm) continue;

      score += queryVector[queryTerm] / queryVector[queryTerm] *
        (BM25_UPPER_BOUND + 1) * pageVector[pageTerm] / (pageVector[pageTerm] + BM25_UPPER_BOUND) *
        Math.log((pagesCount + 1) / terms[pageTerm].pages.length);
    }
  }

  return score;
}
