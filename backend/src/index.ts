import express from 'express';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import Player from './models/Player';
import {
  addPlayersToGame,
  createGame
} from './controllers/game/gameController';
import { getAllPlayers } from './controllers/player/playerController';

void Player;

mongoose.connect(env.MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (_, res) => {
  res.send(
    `Hello World!<br><br>Database connection status: ${
      mongoose.connection.readyState === 1 ? 'successful' : 'unsuccessful'
    }`
  );
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

app.post('/games/:id/players/add', async (req, res) => {
  const { id: gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) {
    return void res.status(404).json({ error: 'Game not found' });
  }
  let playerIds;
  if (typeof req.body === 'string') {
    playerIds = [req.body];
  } else if (
    Array.isArray(req.body) &&
    req.body.every((id) => typeof id === 'string')
  ) {
    playerIds = req.body;
  } else {
    return void res
      .status(400)
      .json({ error: 'Invalid request - expected an id or an array of ids' });
  }
  await addPlayersToGame(gameId, playerIds);
  return void res.sendStatus(200);
});

app.get('/players', async (_, res) => {
  res.json(await getAllPlayers());
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});
