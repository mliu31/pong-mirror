import { Handshake, Server } from 'socket.io';
import corsOptions from './util/corsOptions';
import { sessionMiddleware } from './app';

import sharedSession from 'express-socket.io-session';
import { IPlayer } from './models/Player';

const io = new Server({
  cors: corsOptions
});

io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true
  })
);

io.use((socket, next) => {
  const player = (socket.handshake as Handshake).session?.player;
  if (player === undefined) {
    return next(
      new Error('Unauthorized, please use an authenticated Express session')
    );
  }
  next();
});

io.on('connection', (socket) => {
  const player = (socket.handshake as Handshake).session?.player;
  if (player === undefined) {
    console.error(
      'Socket tried to connect without being authenticated, middleware should have caught this!'
    );
    // force-disconnect the socket
    return socket.disconnect(true);
  }
  socket.join(player._id.toString());
});

export default io;

export const notifyPlayer = (player: IPlayer, event: string, data: unknown) =>
  io.to(player._id.toString()).emit(event, data);
