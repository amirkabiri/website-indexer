import Queue from "../models/queue";
import Page from "../models/page";
import shouldCrawlURL from "./shouldCrawlURL";

export default async function addURLToQueue(url, options = {}){
  if(!shouldCrawlURL(url)) return false;
  if(await Page.findOne({ url })) return false;

  try{
    await Queue.create({ ...options, url })
    return true;
  }catch (e){
    return false;
  }
}