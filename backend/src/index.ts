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
    cookie: { secure: false }
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

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});

app.put('/games/:gameid/players/:pid/team/:team', async (req, res) => {
  const { gameid, pid, team } = req.params;
  const game = await setPlayerTeam(gameid, pid, team);
  res.json(game);
});

// Leaderboard and rank related routes

/**
 * Recalculates and updates the ranks for all players.
 */
app.post('/update-ranks', async (req, res) => {
  try {
    await updateRanks();
    res.status(200).json({ message: 'Ranks updated successfully.' });
  } catch (error) {
    console.error('Error updating ranks:', error);
    res.status(500).json({ error: 'Failed to update ranks.' });
  }
});

/**
 * Fetches leaderboard data based on selected tab
 */
app.get('/leaderboard', (async (req, res) => {
  try {
    const tab = req.query.tab as 'Top' | 'League';
    const userIdParam = req.query.userId as string;
    if (!tab || !userIdParam) {
      return res
        .status(400)
        .json({ error: 'Missing required query parameters: tab, userId' });
    }
    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ error: 'Invalid userId, must be a number.' });
    }

    const leaderboardData = await fetchLeaderboard(tab, userId);
    res.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
}) as RequestHandler);
