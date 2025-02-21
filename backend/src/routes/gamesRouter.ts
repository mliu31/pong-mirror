import {
  createGame,
  getGame,
  PlayerUpdateRecord,
  setPlayerTeam,
  updatePlayersInGame
} from '../controllers/game/gameController';
import express from 'express';

const router = express.Router();

router.post('/', async (_, res) => {
  const game = await createGame();
  res.json({ id: game._id });
});

router.get('/:gameid', async (req, res) => {
  res.json(await getGame(req.params.gameid));
});

const isPlayerUpdateRecord = (obj: unknown): obj is PlayerUpdateRecord =>
  typeof obj === 'object' &&
  obj !== null &&
  Object.values(obj).every((v) => typeof v === 'boolean');

router.patch('/:id/players', async (req, res) => {
  const { id: gameId } = req.params;

  const playerUpdates = req.body;
  if (!isPlayerUpdateRecord(playerUpdates)) {
    return void res
      .status(400)
      .send('Invalid request body, expected Record<string, boolean>');
  }

  return void res.json(await updatePlayersInGame(gameId, playerUpdates));
});

router.put('/:gameid/players/:pid/team/:team', async (req, res) => {
  const { gameid, pid, team } = req.params;
  const game = await setPlayerTeam(gameid, pid, team);
  res.json(game);
});

export default router;
