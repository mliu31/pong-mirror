import express from 'express';
import {
  getGameInvites,
  invitePlayers,
  getPlayerInvites
} from '../controllers/invite/inviteController';

const router = express.Router();

// invite players to a certain game
router.put('/game/:id', async (req, res) => {
  const { id: gameid } = req.params;
  const pids = req.body;
  console.log('made it ot router');
  try {
    await invitePlayers(gameid, pids);
    return void res.json({ message: 'Players invited successfully' });
  } catch (error) {
    console.error('Error inviting players:', error);
    return void res.status(500).send('Failed to invite players');
  }
});

// fetch all invites for certain game
router.get('/game/:id', async (req, res) => {
  const { id: gameid } = req.params;
  try {
    const invites = await getGameInvites(gameid);
    return void res.json(invites);
  } catch (error) {
    console.error('Error fetching game invites:', error);
    return void res.status(500).send('Failed to fetch game invites');
  }
});

//  get all pending invites for a certian player
router.get('/player/:id', async (req, res) => {
  const { id: pid } = req.params;

  try {
    const invites = await getPlayerInvites(pid);
    return void res.json(invites);
  } catch (error) {
    console.error('Error fetching player invites:', error);
    return void res.status(500).send('Failed to fetch player invites');
  }
});

export default router;
