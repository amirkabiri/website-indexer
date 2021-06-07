require('./core/config');
console.log('Service: Web');

const mongoose = require('./core/db').default();
const http = require('./core/http').default(process.env.PORT || 3000);
const io = require('./core/socket').default(http);
const trie = require('./core/trie');

export { io, mongoose, http, trie };