import {
  addPlayersToGame,
  createGame,
  getGame,
  joinGame,
  setGameWinner,
  setPlayerTeam
} from '../controllers/game/gameController';
import { getPlayer } from '../controllers/player/playerController';
import express from 'express';
import { requireLoggedInHandler } from './authRouter';

const router = express.Router();

// TODO: Uncomment this once frontend login is implemented
router.use(requireLoggedInHandler);

router.post('/', async (req, res) => {
  const playerId = req.session.player?._id;
  if (playerId === undefined) {
    throw new Error(
      'Logged-in player not found, this route should be protected!'
    );
  }
  const loggedInPlayer = await getPlayer(playerId as unknown as string);
  const game = await createGame(loggedInPlayer);
  res.json({ id: game._id });
});

// get game
router.get('/:gameid', async (req, res) => {
  const game = await getGame(req.params.gameid);
  if (game === null) return void res.status(404).send('Game not found');
  return void res.json(game);
});

// add players to game
router.patch('/:id/players', async (req, res) => {
  const { id: gameId } = req.params;
  const pids = req.body;
  return void res.json(await addPlayersToGame(gameId, pids));
});

// add currently logged in player to game
router.post('/:gameid/join', async (req, res) => {
  const { gameid } = req.params;
  const player = req.session.player;
  if (player === undefined) {
    return void res.status(401).send('Unauthorized');
  }
  return void res.json(await joinGame(gameid, player));
});

// set player team
router.put('/:gameid/players/:pid/team/:team', async (req, res) => {
  const { gameid, pid, team } = req.params;
  const game = await setPlayerTeam(gameid, pid, team);
  res.json(game);
});

// set game winner
router.patch('/:gameid/winner/:team', async (req, res) => {
  const { gameid, team } = req.params;
  return void res.json(await setGameWinner(gameid, team));
});

export default router;
