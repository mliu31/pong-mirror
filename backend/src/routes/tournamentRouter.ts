import express from 'express';
import {
  createTournament,
  getTournament,
  deleteTournament,
  addTeam,
  reseedTeams,
  removeTeam
} from '../controllers/tournament/tournamentController';

const router = express.Router();

router.put('/createTournament/:name', async (req, res) => {
  try {
    const tournament = await createTournament(req.params.name);

    res.status(201).json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tournament = await getTournament(req.params.id);

    if (!tournament) {
      return void res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteTournament(req.params.id);
    return void res.status(200);
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/teams', async (req, res) => {
  try {
    const { playerId } = req.body;
    const tournament = await addTeam(req.params.id, playerId);

    res.json(tournament);
  } catch (error) {
    console.error('Error adding team to tournament:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/seed', async (req, res) => {
  try {
    const tournament = await reseedTeams(req.params.id);

    res.json(tournament);
  } catch (error) {
    console.error('Error reseeding tournament teams:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:tournamentId/teams/:teamId', async (req, res) => {
  try {
    const { tournamentId, teamId } = req.params;

    await removeTeam(tournamentId, teamId);

    res.json({ message: 'Team removed from tournament successfully' });
  } catch (error) {
    console.error('Error removing team from tournament:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
