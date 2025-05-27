import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import { IPlayer } from './models/Player';
import gamesRouter from './routes/gamesRouter';
import playersRouter from './routes/playersRouter';
import leaderboardRouter from './routes/leaderboardRouter';
import corsOptions from './util/corsOptions';
import groupRouter from './routes/groupRouter';
import tournamentRouter from './routes/tournamentRouter';
import sessionMiddleware from './util/sessionMiddleware';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

declare module 'express-session' {
  interface SessionData {
    player: IPlayer;
  }
}

app.use(sessionMiddleware);

app.get('/', async (_, res) => {
  res.send(`Hello World!`);
});

app.use('/auth', authRouter);
app.use('/games', gamesRouter);
app.use('/players', playersRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/groups', groupRouter);
app.use('/tournaments', tournamentRouter);

export default app;
