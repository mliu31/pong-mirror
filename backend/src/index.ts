import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import MongoStore from 'connect-mongo';
import { IPlayer } from './models/Player';

// Import routers
import leaderboardRouter from './routes/leaderboardRouter';
import playersRouter from './routes/playersRouter';

// if we can't connect to the database, exit immediately - don't let Express start listening.
// this handler must be registered before calling mongoose.connect.
mongoose.connection.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

await mongoose.connect(env.MONGODB_URI);

const app = express();

app.use(cors());
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

app.use('/players', playersRouter);

app.use('/leaderboard', leaderboardRouter);

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});
