import express from 'express';
import { getAllPlayers } from '../controllers/player/playerController';
import { requireLoggedInHandler } from './auth';

const router = express.Router();

router.use(requireLoggedInHandler);

router.get('/', async (_, res) => {
  res.json(await getAllPlayers());
});

export default router;
