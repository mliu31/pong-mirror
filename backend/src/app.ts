import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import env from './util/env';
import cors from 'cors';
import authRoutes from './routes/authRouter.js';
import { IPlayer } from './models/Player';
import gamesRouter from './routes/gamesRouter';
import playersRouter from './routes/playersRouter';
import MongoStore from 'connect-mongo';
import corsOptions from './util/corsOptions';
import server from './server';

// if we can't connect to the database, exit immediately - don't let Express start listening.
// this handler must be registered before calling mongoose.connect.
mongoose.connection.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

await mongoose.connect(env.MONGODB_URI);

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

declare module 'express-session' {
  interface SessionData {
    player: IPlayer;
  }
}

app.use(
  session({
    secret: env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({
      clientPromise: Promise.resolve(mongoose.connection.getClient())
    })
  })
);

app.get('/', async (_, res) => {
  res.send(`Hello World!`);
});

app.use('/auth', authRoutes);

app.use('/games', gamesRouter);

app.use('/players', playersRouter);

export default app;
