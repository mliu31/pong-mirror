import express from 'express';
import Player from '../models/Player';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, name } = req.body;

    const player = await Player.findOne({ email, name });
    if (!player) {
      return void res.status(400).json({ message: 'Invalid credentials' });
    }

    // req.session.player = player;
    res.json({
      message: 'Login successful',
      user: { id: player._id, email: player.email, name: player.name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
