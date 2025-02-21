import express from 'express';
import { getAllPlayers } from '../controllers/player/playerController';

const router = express.Router();

router.get('/players', async (_, res) => {
  res.json(await getAllPlayers());
});

export default router;
