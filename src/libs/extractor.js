import trim from './trim'
import { JSDOM } from "jsdom";
import axios from 'axios';

export default class Extractor{
  /**
   * @param url {URL}
   */
  constructor(url) {
    this.url = url;
  }

  async fetch(){
    const { headers, data: html } = await axios.get(this.url.toString());

    if(!headers['content-type'] || headers['content-type'].indexOf('text/html') === -1) return null;

    this.html = html;
    this.dom = new JSDOM(this.html, {
      url: this.url.toString()
    });
    this.window = this.dom.window;
    this.document = this.window.document;

    return this;
  }

  extractTexts(){
    const { document } = this;
    let queue = [...document.body.children];
    let result = Object.values(this.extractMeta()).join(' ');

    while(queue.length){
      const el = queue.pop();
      if(['SCRIPT'].includes(el.tagName)) continue;

      for(const node of [...el.childNodes].filter(node => node.nodeType === 3)){
        const nodeValue = node.nodeValue.trim();
        if(!nodeValue) continue;

        result += '\n' + nodeValue;
      }

      queue = queue.concat([...el.children])
    }

    return result;
  }

  extractLinks(){
    const { document } = this;
    const links = document.querySelectorAll('a');
    const result = [];

    for(let i = 0; i < links.length; i ++){
      const link = links[i];
      try{
        new URL(link.href)
        result.push(link.href);
      }catch (e){
        try{
          const newLink = trim(this.url.toString(), '/') + '/' + trim(link.href, '/');
          new URL(newLink)
          result.push(newLink)
        }catch (e){

        }
      }
    }

    return result;
  }

  extractMeta(){
    const { document } = this;

    const title = document.head.querySelector('title');
    const description = document.head.querySelector('meta[name="description"]');
    const keywords = document.head.querySelector('meta[name="keywords"]');

    return {
      title: title ? title.textContent : '',
      description: description ? description.getAttribute('content') : '',
      keywords: keywords ? keywords.getAttribute('content') : ''
    }
  }
}