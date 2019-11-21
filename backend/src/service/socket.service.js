const socketIo = require('socket.io');

let sockets = [];

const init = (server) => {
  const io = socketIo(server);
  io.on('connection', (socket) => {
    log('Socket connected');
    socket.on('disconnect', () => {
      log('Socket disconnected');
      sockets = sockets.filter(socket => !!socket.connected);
    });
    sockets.push(socket);
  });
};

const log = (text, params = '') => {
  console.log(`[socket.service] -> ${text}`, params);
};

module.exports = {
  init
};