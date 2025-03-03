import express from 'express';
import { RequestHandler } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import Player from './models/Player';
import { updateRanks } from './controllers/leaderboard/rankingCurrent';
import { fetchLeaderboard } from './controllers/leaderboard/leaderboardFetch';

import {
  createGame,
  PlayerUpdateRecord,
  setPlayerTeam,
  updatePlayersInGame
} from './controllers/game/gameController';
import { getAllPlayers } from './controllers/player/playerController';

void Player;

// import updateElo from './controllers/game/leaderboard/updateElo';
import authRoutes from './routes/authRouter.js';
import { IPlayer } from './models/Player';
import gamesRouter from './routes/gamesRouter';
import playersRouter from './routes/playersRouter';
import MongoStore from 'connect-mongo';
import leaderboardRouter from './routes/leaderboardRouter';

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

app.get('/', async (_, res) => {
  res.send(`Hello World!`);
});

app.post('/games', async (_, res) => {
  const game = await createGame();
  res.json({ id: game._id });
});

app.get('/games/:gameid', async (req, res) => {
  const game = await Game.findById(req.params.gameid).populate(
    'players.player'
  );
  res.json(game);
});

const isPlayerUpdateRecord = (obj: unknown): obj is PlayerUpdateRecord =>
  typeof obj === 'object' &&
  obj !== null &&
  Object.values(obj).every((v) => typeof v === 'boolean');

app.patch('/games/:id/players', async (req, res) => {
  const { id: gameId } = req.params;

  const playerUpdates = req.body;
  if (!isPlayerUpdateRecord(playerUpdates)) {
    return void res
      .status(400)
      .send('Invalid request body, expected Record<string, boolean>');
  }

  return void res.json(await updatePlayersInGame(gameId, playerUpdates));
});

app.get('/players', async (_, res) => {
  res.json(await getAllPlayers());
});

app.use('/leaderboard', leaderboardRouter);

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});
