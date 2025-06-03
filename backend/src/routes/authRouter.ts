import express, { RequestHandler } from 'express';
import Player from '../models/Player';
import { updateRanks } from '../controllers/leaderboard/rankingCurrent';

const router = express.Router();

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

  // create player if the player doesn't exist
  if (!player) {
    // parse local part of Dartmouth e-mail to construct username
    const localPart = googlePlayerInfo.email.split('@')[0];
    const parts = localPart.split('.').map((part: string) => {
      // format initials
      if (part.length === 1) {
        return part.toUpperCase() + '.';
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    });
    const username = parts.join(' ');

    player = new Player({
      name: username,
      email: googlePlayerInfo.email,
      googleID: googlePlayerInfo.sub,
      eloHistory: [
        {
          elo: 1200,
          date: new Date()
        }
      ]
    });
    await player.save();
    await updateRanks();
  }
  // player session
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
