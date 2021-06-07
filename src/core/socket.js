import socketIO from "socket.io";
import fs from "fs";
import path from "path";
import calculateHostsOverview from "../libs/calculateHostsOverview";

const SOCKETS_DIR = path.join(__dirname, '../sockets');

export default function (http){
  const io = socketIO(http);
  const emitOverview = async () => io.emit('overview', await calculateHostsOverview())

  fs.readdir(SOCKETS_DIR, (err, all_files) => {
    if(err) throw err;
    const files = all_files.filter(file => file[0] !== '_');
    const onConnect = all_files.includes('_connect.js') ? require(path.join(SOCKETS_DIR, '_connect.js')).default : () => null;

    // send statistics to users
    setInterval(emitOverview, 10000);

    io.on('connection', socket => {
      onConnect(socket);

      for(const file of files){
        const { default: socketListener, ROUTE: socketRoute } = require(path.join(SOCKETS_DIR, file));
        socket.on(socketRoute, socketListener(socket))
      }
    })
  });

  return io;
}