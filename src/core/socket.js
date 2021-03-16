import socketIO from "socket.io";
import fs from "fs";
import path from "path";

const SOCKETS_DIR = path.join(__dirname, '../sockets');

export default function (http){
  const io = socketIO(http);

  fs.readdir(SOCKETS_DIR, (err, all_files) => {
    if(err) throw err;
    const files = all_files.filter(file => file[0] !== '_');
    const onConnect = all_files.includes('_connect.js') ? require(path.join(SOCKETS_DIR, '_connect.js')).default : () => null;

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