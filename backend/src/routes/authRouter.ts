import express, { RequestHandler } from 'express';
import Player from '../models/Player';
import { newPlayer } from '../controllers/player/playerController';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email } = req.body;
    const lowercasedEmail = email.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      typeof name !== 'string' ||
      typeof lowercasedEmail !== 'string' ||
      !emailRegex.test(lowercasedEmail)
    ) {
      return void res
        .status(400)
        .json({ message: 'Please enter a valid username and email.' });
    }

    const player = await newPlayer(name, lowercasedEmail);
    req.session.player = player;

    res.json({
      message: 'Sign up successful!',
      player
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/googleSignup', async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return void res.status(400).json({ message: 'Access token not found' });
  }

  const googleRes = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
  );
  if (!googleRes.ok) {
    console.error('Google API error:', await googleRes.text());
    return void res.status(401).json({ message: 'Invalid Google token' });
  }

  const googlePlayerInfo = await googleRes.json();

  // check if the player with that email exists
  let player = await Player.findOne({ email: googlePlayerInfo.email });
  if (!player) {
    player = new Player({
      name: googlePlayerInfo.name,
      email: googlePlayerInfo.email,
      googleID: googlePlayerInfo.sub
    });

    await player.save();
  }

  // save player
  req.session.player = player;
  res.json(player);
});

if (process.env.BACKDOOR === 'yes') {
  console.warn(
    'Backdoor access enabled! This should only be used in development.'
  );
  router.post('/backdoor', async (req, res) => {
    try {
      const { email } = req.body;
      const lowercasedEmail = email.toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        typeof lowercasedEmail !== 'string' ||
        !emailRegex.test(lowercasedEmail)
      ) {
        return void res
          .status(400)
          .json({ message: 'Please enter a valid email address.' });
      }

      const player = await Player.findOne({ email: lowercasedEmail });
      if (!player) {
        return void res.status(400).json({
          message: 'Could not find a player with that email address.'
        });
      }

      Player.findOne();
      req.session.player = player;
      res.json({
        message: 'Login successful',
        player
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
}

router.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to log out' });
    }

    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

export const requireLoggedInHandler: RequestHandler = (req, res, next) => {
  if (req.session.player === undefined) {
    return void res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export default router;
