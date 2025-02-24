import express, { RequestHandler } from 'express';
import Player from '../models/Player';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (typeof email !== 'string' || typeof name !== 'string') {
      return void res
        .status(400)
        .json({ message: 'Invalid request, expected email and name' });
    }

    const player = await Player.findOne({ email, name });

    if (!player) {
      return void res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.player = player;
    res.json({
      message: 'Login successful',
      user: { id: player._id, email: player.email, name: player.name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export const requireLoggedInHandler: RequestHandler = (req, res, next) => {
  if (req.session.player === undefined) {
    return void res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export default router;
