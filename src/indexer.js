require('./core/config');
console.log('Service: Indexer');

const mongoose = require('./core/db').default();
const indexURL = require('./libs/indexURL').default;
// const { subscribe } = require("./events/new-url-to-index");

let running = false;

mongoose.connection.on('open', () => run('db'));
// subscribe(() => run('socket'));
setInterval(() => run('interval'), 1000 * 60);

async function run(reason){
  if(running) return;

  console.log(`Indexing process started | trigger: ${ reason }`)
  running = true;

  while(running && !(await indexURL())){}

  running = false;
  console.log(`Indexing process ended | trigger: ${ reason }`)
}
