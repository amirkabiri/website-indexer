import natural from "natural";

export default function stemmer(tokens){
  return tokens.map(token => natural.PorterStemmer.stem(token));
}