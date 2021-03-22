import Queue from "../models/queue";
import Page from "../models/page";
import shouldCrawlURL from "./shouldCrawlURL";

export default async function addURLToQueue(url){
  if(!shouldCrawlURL(url)) return false;
  if(await Page.findOne({ url })) return false;

  try{
    await Queue.create({ url })
    return true;
  }catch (e){
    return false;
  }
}