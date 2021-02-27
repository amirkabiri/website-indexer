import mongoose, {Schema} from 'mongoose'
import dotenv from 'dotenv-flow'
import express from 'express'
import { createServer } from 'http'
import socketIO from 'socket.io';
import path from 'path';
import fs from 'fs';
import autoIncrement from 'mongoose-auto-increment';

console.clear();
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const http = createServer(app);
const io = socketIO(http);
const connect = () => mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

connect();
autoIncrement.initialize(mongoose.connection);
mongoose.connection.on('error', err => {
  console.error('Mongoose Error: ' + err);
  connect();
});
mongoose.connection.once('open', function() {
  console.log('db connected')
  // setTimeout(async () => {
  //   const Term = require('./models/term').default;
  //   const term = await Term.findOne();
  //   // const term = await Term.create({
  //   //   value: 'hello',
  //   //   pages: [{
  //   //     _id: '603a94e5ccef7515e4c03be2',
  //   //     id: 0,
  //   //     frequency: 2
  //   //   }]
  //   // })
  //
  //   console.log(JSON.stringify(term.pages, null, 2))
  //   console.log(`pages count : ${ term.pages.length }`)
  // });
});
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/'));
app.use((req, res) => {
  res.render('views/index');
})

http.listen(PORT, () => console.log('server is running on port ' + PORT))


fs.readdir(path.join(__dirname, 'sockets'), (err, all_files) => {
  if(err) throw err;
  const files = all_files.filter(file => file[0] !== '_');
  const onConnect = all_files.includes('_connect.js') ? require(path.join(__dirname, 'sockets/_connect.js')).default : () => null;

  io.on('connection', socket => {
    onConnect(socket);

    for(const file of files){
      const { default: socketListener, ROUTE: socketRoute } = require(path.join(__dirname, 'sockets/' + file));
      socket.on(socketRoute, socketListener(socket))
    }
  })
});