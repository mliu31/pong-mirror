import * as express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import Player from './models/Player';

import {
  createGame,
  PlayerUpdateRecord,
  updatePlayersInGame,
} from './controllers/game/gameController';
import { getAllPlayers } from './controllers/player/playerController';

import { IPlayer } from './models/Player';
import MongoStore from 'connect-mongo';
import leaderboardRouter from './routes/leaderboardRouter';

// Exit immediately if unable to connect to the database.
// This must be registered before calling mongoose.connect.
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
      clientPromise: Promise.resolve(mongoose.connection.getClient()),
    }),
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
  const game = await Game.findById(req.params.gameid).populate('players.player');
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
    return res
      .status(400)
      .send('Invalid request body, expected Record<string, boolean>');
  }

  const updatedGame = await updatePlayersInGame(gameId, playerUpdates);
  return res.json(updatedGame);
});

app.get('/players', async (_, res) => {
  const players = await getAllPlayers();
  res.json(players);
});

app.use('/leaderboard', leaderboardRouter);

app.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    console.error('Error fetching player profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ensure app.listen is the final call in your file (or has a semicolon after it) so that subsequent route calls aren’t chained to its return value.
app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});