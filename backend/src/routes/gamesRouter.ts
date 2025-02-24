import {
  createGame,
  getGame,
  PlayerUpdateRecord,
  setPlayerTeam,
  updatePlayersInGame
} from '../controllers/game/gameController';
import express from 'express';
// import { requireLoggedInHandler } from './authRouter';

const router = express.Router();

// TODO: Uncomment this once frontend login is implemented
// router.use(requireLoggedInHandler);

router.post('/', async (/*req*/ _, res) => {
  // TODO: Uncomment this once frontend login is implemented
  // const player = req.session.player;
  // if (player === undefined) {
  //   throw new Error(
  //     'Logged-in player not found, this route should be protected!'
  //   );
  // }
  const game = await createGame(/* player */);
  res.json({ id: game._id });
});

router.get('/:gameid', async (req, res) => {
  const game = await getGame(req.params.gameid);
  if (game === null) return void res.status(404).send('Game not found');
  return void res.json(game);
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
