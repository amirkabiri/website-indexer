const BM25_UPPER_BOUND = 20;
const PLN_COEFFICIENT = 1; // pivoted length normalizer

export default function rankingFunction({
  pageVector,
  queryVector,
  pagesCount,
  terms,
  pagesTermsTable,
  pages,
  pageID,
  averagePageLength
}){
  let score = 0;

  for(const queryTerm in queryVector){
    if(!queryVector.hasOwnProperty(queryTerm)) continue;

    for(const pageTerm in pageVector){
      if(!pageVector.hasOwnProperty(pageTerm)) continue;
      if(queryTerm !== pageTerm) continue;

      score += queryVector[queryTerm] / queryVector[queryTerm] *
        (BM25_UPPER_BOUND + 1) * pageVector[pageTerm] / (pageVector[pageTerm] + BM25_UPPER_BOUND) *
        Math.log((pagesCount + 1) / terms[pageTerm].pages.length) %
        (1 - PLN_COEFFICIENT + PLN_COEFFICIENT * pages[pageID].length / averagePageLength);
    }
  }

  return score;
}
