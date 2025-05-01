import express from 'express';
import {
  getGameInvites,
  invitePlayers,
  getPlayerInvites,
  setPlayerInvite
} from '../controllers/invite/inviteController';
import { InviteValue } from '../constants/INVITE';

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

router.put('/player/:pid/game/:gid/decision/:status', async (req, res) => {
  const { pid, gid, status } = req.params;

  try {
    // Assuming there's a function to handle player decisions for invites
    await setPlayerInvite(pid, gid, status as InviteValue);
    return void res.json({ message: 'Decision recorded successfully' });
  } catch (error) {
    console.error('Error recording decision:', error);
    return void res.status(500).send('Failed to record decision');
  }
});

export default router;
