/*export default */function editDistance(word1, word2){
  const table = [];
  const rows = word1.length + 1;
  const cols = word2.length + 1;
  for(let i = 0; i < rows; i ++){
    table.push(Array.from({ length: cols }, () => 0));
  }

  for(let i = 0; i < cols; i ++){
    table[0][i] = i;
  }
  for(let i = 0; i < rows; i ++){
    table[i][0] = i;
  }

  for(let r = 1; r < rows; r ++){
    for(let c = 1; c < cols; c ++){
      table[r][c] = Math.min(
        table[r - 1][c] + 1,
        table[r][c - 1] + 1,
        table[r - 1][c - 1] + (word1[r - 1] === word2[c - 1] ? 0 : 1)
      );
    }
  }

  // return table
  const lastRow = table[table.length - 1];
  return lastRow[lastRow.length - 1];
}


console.log('cast', 'fast', editDistance('cast', 'fast'))
console.log('wha', 'why', editDistance('wha', 'why'))
console.log('fast', 'fast', editDistance('fast', 'fast'))