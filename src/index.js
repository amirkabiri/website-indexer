import dotenv from 'dotenv-flow'

console.clear();
dotenv.config();

const mongoose = require('./core/db').default();
const http = require('./core/http').default(process.env.PORT || 3000);
const io = require('./core/socket').default(http);
require('./core/indexer').default();

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});

export { io, mongoose, http };