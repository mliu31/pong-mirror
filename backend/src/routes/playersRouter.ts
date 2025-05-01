import express from 'express';
import {
  getAllPlayers,
  getPlayer,
  addPlayerFriend,
  removePlayerFriend
} from '../controllers/player/playerController';

import { requireLoggedInHandler } from './authRouter';

const router = express.Router();

// TODO: Uncomment this once frontend login is implemented
router.use(requireLoggedInHandler);

router.get('/', async (_, res) => {
  res.json(await getAllPlayers());
});

router.get('/:pid', async (req, res) => {
  try {
    const player = await getPlayer(req.params.pid);
    return void res.status(200).json(player);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      return void res.status(404).json({ message: 'Error finding player' });
    }
  }
});

router.put('/:pid/friend/:fid', async (req, res) => {
  try {
    const updatedPlayer = await addPlayerFriend(req.params.pid, req.params.fid);
    res.status(200).json(updatedPlayer);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'An unknown error occurred when adding friend'
      });
    }
  }
});

router.delete('/:pid/friend/:fid', async (req, res) => {
  try {
    const updatedPlayer = await removePlayerFriend(
      req.params.pid,
      req.params.fid
    );

    res.status(200).json(updatedPlayer);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'An unknown error occurred when removing friend'
      });
    }
  }
});

export default router;
