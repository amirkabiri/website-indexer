import { subscribe } from "../events/new-url-to-index";
import indexURL from '../libs/indexURL';

async function run(reason){
  if(running) return;

  console.log(`run started | ${ reason }`)
  running = true;

  while(running && !(await indexURL())){}

  running = false;
  console.log(`run ended | ${ reason }`)
}

let running = false;

export default function(){
  run('init');
  subscribe(() => run('socket'));
  setInterval(() => run('interval'), 1000 * 60 * 10);
}