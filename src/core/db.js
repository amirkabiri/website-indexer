import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const connect = () => mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

export default function (){
  autoIncrement.initialize(mongoose.connection);
  mongoose.connection.on('error', err => {
    console.error('Mongoose Error: ' + err);
    connect();
  });
  mongoose.connection.once('open', function() {
    console.log('db connected')
    // require('../sockets/search').default('socket')('hello world', () => null)
  });

  connect();

  return mongoose;
}

