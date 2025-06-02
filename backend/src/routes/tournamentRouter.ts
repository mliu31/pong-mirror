import express from 'express';
import {
  createTournament,
  getTournament,
  deleteTournament,
  addTeam,
  reseedTeams,
  removeTeam,
  getAllTeams,
  startTournament,
  getTeam,
  addPlayer,
  updateMatchWinner
} from '../controllers/tournament/tournamentController';

const router = express.Router();

router.put('/createTournament/:name', async (req, res) => {
  try {
    const tournament = await createTournament(
      req.params.name,
      req.body.adminId
    );

    res.status(201).json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/getTournament/:id', async (req, res) => {
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

router.post('/addTeam/:id/teams/:playerId', async (req, res) => {
  console.log('Router - Request body:', req.body);
  console.log('Router - playerName:', req.body.playerName);
  try {
    const tournament = await addTeam(
      req.params.id,
      req.params.playerId,
      req.body.playerName
    );
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

router.delete('/removeTeam/:tournamentId/teams/:teamId', async (req, res) => {
  try {
    const { tournamentId, teamId } = req.params;

    await removeTeam(tournamentId, teamId);

    res.json({ message: 'Team removed from tournament successfully' });
  } catch (error) {
    console.error('Error removing team from tournament:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/teams', async (req, res) => {
  try {
    const teams = await getAllTeams(req.params.id);
    res.json(teams);
  } catch (error) {
    console.error('Error fetching tournament teams:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/start', async (req, res) => {
  try {
    const tournament = await startTournament(req.params.id);
    res.json(tournament);
  } catch (error) {
    console.error('Error starting tournament:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/getTeam/:id', async (req, res) => {
  try {
    const team = await getTeam(req.params.id);
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/addPlayer/:tournamentId/teams/:teamId/player/:playerId',
  async (req, res) => {
    try {
      const tournament = await addPlayer(
        req.params.tournamentId,
        req.params.teamId,
        req.params.playerId
      );
      res.json(tournament);
    } catch (error) {
      console.error('Error adding player to tournament:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.put(
  '/updateMatchWinner/:tournamentId/match/:matchId/side/:winningSide',
  async (req, res) => {
    try {
      const tournament = await updateMatchWinner(
        req.params.tournamentId,
        req.params.matchId,
        req.params.winningSide as 'LEFT' | 'RIGHT'
      );
      res.json(tournament);
    } catch (error) {
      console.error('Error updating match winner:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;
