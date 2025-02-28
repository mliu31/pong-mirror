import express from 'express';
import {
  getAllPlayers,
  getPlayer,
  addPlayerFriend,
  removePlayerFriend
} from '../controllers/player/playerController';
// import { requireLoggedInHandler } from './authRouter';

const router = express.Router();

// TODO: Uncomment this once frontend login is implemented
// router.use(requireLoggedInHandler);

router.get('/', async (_, res) => {
  res.json(await getAllPlayers());
});

router.get('/:pid', async (req, res) => {
  const player = await getPlayer(req.params.pid);
  if (player === null) return void res.status(404).send('Player not found');

  return void res.json(player);
});

router.put('/:pid/friend/:fid', async (req, res) => {
  const updatedPlayer = await addPlayerFriend(req.params.pid, req.params.fid);

  res.json(updatedPlayer);
});

router.delete('/:pid/friend/:fid', async (req, res) => {
  const updatedPlayer = await removePlayerFriend(
    req.params.pid,
    req.params.fid
  );

  res.json(updatedPlayer);
});

export default router;
