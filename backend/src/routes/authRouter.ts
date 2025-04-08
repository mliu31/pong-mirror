import express, { RequestHandler } from 'express';
import Player from '../models/Player';
import { newPlayer } from '../controllers/player/playerController';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (typeof name !== 'string' || typeof email !== 'string') {
      return void res
        .status(400)
        .json({ message: 'Invalid request, expected email and name' });
    }

    const player = await newPlayer(name, email);
    req.session.player = player;

    res.json({
      message: 'Sign up successful',
      player: {
        userID: player.userID,
        name: player.name,
        email: player.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== 'string') {
      return void res
        .status(400)
        .json({ message: 'Invalid request, expected email' });
    }

    const player = await Player.findOne({ email });
    if (!player) {
      return void res.status(400).json({ message: 'Invalid credentials' });
    }

    Player.findOne();
    req.session.player = player;
    res.json({
      message: 'Login successful',
      player: {
        userID: player.userID,
        name: player.name,
        email: player.email
      }
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
