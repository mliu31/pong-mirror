import { createServer } from 'http';
import app from './app';
import io from './io';

const server = createServer();

server.on('request', app);
io.attach(server);

export default server;
