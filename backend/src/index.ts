import express from 'express';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import Player from './models/Player';
import {
  createGame,
  PlayerUpdateRecord,
  setPlayerTeam,
  updatePlayersInGame
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

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});

app.put('/games/:gameid/players/:pid/team/:team', async (req, res) => {
  const { gameid, pid, team } = req.params;
  const game = await setPlayerTeam(gameid, pid, team);
  res.json(game);
});
