import express from 'express';
import {
  getAllPlayers,
  getPlayer,
  addFriend
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

router.post('/:pid/friends', async (req, res) => {
  const { friendId } = req.body;
  if (!friendId) {
    return void res.status(400).json({ message: 'friendId is required' });
  }
  try {
    const updatedPlayer = await addFriend(req.params.pid, friendId);
    if (!updatedPlayer) {
      return void res.status(404).json({ message: 'Player not found' });
    }
    res.json(updatedPlayer);
  } catch (error) {
    if (error instanceof Error && error.message === 'Friend not found') {
      return void res.status(404).json({ message: error.message });
    }
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Error adding friend', error });
  }
});

export default router;
