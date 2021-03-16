/**
 * @param url {string|URL}
 * @returns {string}
 */
export default function urlNormalizer(url){
  if(!(url instanceof URL)){
    url = new URL(url)
  }

  if(url.hostname.substr(0, 4) === 'www.'){
    url.hostname = url.hostname.substr(4)
  }

  url.hash = '';

  return url.toString()
}