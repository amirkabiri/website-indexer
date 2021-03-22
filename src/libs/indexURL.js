import HostModel from "../models/host";
import PageModel from "../models/page";
import QueueModel from "../models/queue";
import Extractor from "./extractor";
import md5 from "./md5";
import tokenizer from "./tokenizer";
import stemmer from "./stemmer";
import TermModel from "../models/term";
import isHostNamesSame from "./isHostNamesSame";
import { io } from "../index";
import calculateHostsOverview from "./calculateHostsOverview";
import shouldCrawlURL from "./shouldCrawlURL";
import addURLToQueue from "./addURLToQueue";

const emitOverview = async () => io.emit('overview', await calculateHostsOverview())

export default async function indexURL(){
  // get oldest item in queue
  const target = await QueueModel.findOne().sort({ createdAt : 1 });
  if(!target) return true;
  const { url } = target;

  let host;
  try{
    // create host if not exists
    // if exists, only make done = false
    const { hostname } = new URL(url);
    host = await HostModel.findOne({ host: hostname });
    if(host){
      host.done = false;
      await host.save()
    }else{
      host = await HostModel.create({ host: hostname });
    }

    if(await PageModel.findOne({ url })) return;
    // create page at first, to prevent crawling pages again that had error
    const page = await PageModel.create({ url, host, indexedAt: new Date });

    const extractor = await (new Extractor(new URL(url)).fetch());
    // if Content-Type of page is not text/html, then continue
    if(!extractor) return;

    const hash = md5(extractor.html);
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
    page.hash = hash;
    page.meta = extractor.extractMeta();
    await page.save();

    for(const value in terms){
      let term = await TermModel.findOne({ value })
      if(!term){
        term = await TermModel.create({ value })
      }

      term.insertPage({
        _id: page._id,
        id: page.id,
        frequency: terms[value] || 0
      });
      term.save();
    }

    // find new links from this page and add them to queue
    for(const link of links){
      if(!isHostNamesSame(link, url)) continue;

      await addURLToQueue(link);
    }
  } catch (e){
    console.log(e)
  } finally{
    // remote current page
    await target.remove()

    // make host done
    host.done = true;
    await host.save();

    // send statistics to users
    emitOverview();
  }
}
