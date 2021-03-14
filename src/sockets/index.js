import Extractor from "../libs/extractor";
import isHostNamesSame from "../libs/isHostNamesSame";
import tokenizer from "../libs/tokenizer";
import stemmer from '../libs/stemmer'
import PageModel from '../models/page'
import HostModel from '../models/host'
import TermModel from '../models/term'

export const ROUTE = 'index';

export default socket => async startPoint => {
  const queue = [startPoint];
  let host;

  try{
    const { hostname } = new URL(startPoint);
    host = await HostModel.findOne({ host: hostname });
    if(host){
      host.done = false;
      await host.save()
    }else{
      host = await HostModel.create({ host: hostname });
    }
  }catch (e){
    return console.log(e);
  }

  while(queue.length){
    try{
      const url = queue.pop();
      if(await PageModel.findOne({ url })) continue;

      // create page at first, to prevent crawling pages again that had error
      const page = await PageModel.create({ url, host });

      const extractor = await (new Extractor(new URL(url)).fetch());
      // if Content-Type of page is not text/html, then continue
      if(!extractor) continue;

      const texts = extractor.extractTexts();
      const links = extractor.extractLinks();
      const tokens = tokenizer(texts);
      const stemmedTokens = stemmer(tokens);
      const terms = {};
      let termsCount = 0;

      // counting terms and frequencies
      for(let token of stemmedTokens){
        if(!terms[token]) {
          terms[token] = 0;
          termsCount ++;
        }
        terms[token] ++;
      }

      page.tokensCount = tokens.length;
      page.termsCount = termsCount;
      page.length = texts.length;
      await page.save();

      for(const value in terms){
        let term = await TermModel.findOne({ value })
        if(!term){
          term = await TermModel.create({ value })
        }

        term.insertPage({
          _id: page._id,
          id: page.id,
          frequency: terms[value]
        })
        term.save();
      }

      for(const link of links){
        if(!isHostNamesSame(link, startPoint)) continue;
        queue.push(link);
      }
    }catch(e){
      console.log(e)
    }
  }

  try{
    host.done = true;
    await host.save();
  }catch (e){
    console.log(e)
  }
}
