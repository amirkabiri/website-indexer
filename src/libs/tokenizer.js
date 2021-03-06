import natural from "natural";
const Tokenizer = new natural.WordTokenizer();

export default function tokenizer(text){
  const tokens = Tokenizer.tokenize(text);
  return tokens
    .map(token => token.toLowerCase())
    .filter(token => !new RegExp('^[0-9]+$').test(token))
}
