/**
 * @param string {string}
 * @param char {string}
 * @returns {string}
 */
export default function trim(string, char){
  while(string[0] === char) {
    string = string.substr(1);
  }
  while(string[string.length - 1] === char) {
    string = string.substring(0, string.length - 1);
  }
  return string;
}