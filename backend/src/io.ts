import { Server } from 'socket.io';
import corsOptions from './util/corsOptions';

export default new Server({
  cors: corsOptions
});
