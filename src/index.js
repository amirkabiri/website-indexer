import dotenv from 'dotenv-flow'
import initDB from './core/db';
import initSockets from './core/socket';
import initHTTP from './core/http';

console.clear();
dotenv.config();

const mongoose = initDB();
const http = initHTTP(process.env.PORT || 3000);
const io = initSockets(http);

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});

export { io, mongoose, http };