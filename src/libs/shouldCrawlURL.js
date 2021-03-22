import urlNormalizer from "./urlNormalizer";

const hosts = {
  'en.wikipedia.org': {
    filters: ['index.php']
  }
}

export default function shouldCrawlURL(url){
  let urlClone = url.toLowerCase().replace(/-/g, '');
  const exceptWords = ['login', 'signup', 'signin', 'register'];
  if(exceptWords.some(word => urlClone.indexOf(word) !== -1)) return false;

  if(!(url instanceof URL)){
    url = new URL(url);
  }
  if(hosts[url.host] === undefined) return true;
  urlClone = urlNormalizer(url)

  for(const key of Object.keys(hosts[url.host])){
    const value = hosts[url.host][key];
    switch (key){
      case 'filters':
        if(value.some(pattern => urlClone.match(pattern))) return false;
        break;
    }
  }

  return true;
}