import express from 'express';
import { getAllPlayers } from '../controllers/player/playerController';
// import { requireLoggedInHandler } from './authRouter';

const router = express.Router();

// TODO: Uncomment this once frontend login is implemented
// router.use(requireLoggedInHandler);

router.get('/', async (_, res) => {
  res.json(await getAllPlayers());
});

export default router;
