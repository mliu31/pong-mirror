import express from 'express';
import {
  logBeerPongEvent,
  getBeerPongEvents,
  getBeerPongGameSession,
  getLatestCommentary,
  resetBeerPongGame,
  getPlayerBeerPongStats,
  BeerPongEventRequest
} from '../controllers/beerPong/beerPongController';

const router = express.Router();

// Log a beer pong event (now with automatic commentary generation)
router.post('/games/:gameId/events', async (req, res) => {
  try {
    const { gameId } = req.params;
    const eventData: BeerPongEventRequest = req.body;

    const result = await logBeerPongEvent(gameId, eventData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error logging beer pong event:', error);
    res.status(500).json({ error: 'Failed to log beer pong event' });
  }
});

// TODO: Fix TypeScript typing issue and uncomment
// // Generate commentary for a specific action (standalone endpoint)
// router.post('/commentary/generate', async (req, res) => {
//   try {
//     const { action, gameState }: { action: BeerPongAction; gameState: GameState } = req.body;

//     if (!action || !gameState) {
//       return res.status(400).json({ error: 'Missing action or gameState in request body' });
//     }

//     const commentary = await generateCommentaryForAction(action, gameState);
//     res.json(commentary || { message: 'No commentary generated (cooldown or error)' });
//   } catch (error) {
//     console.error('Error generating commentary:', error);
//     res.status(500).json({ error: 'Failed to generate commentary' });
//   }
// });

// Get all events for a game (for replay)
router.get('/games/:gameId/events', async (req, res) => {
  try {
    const { gameId } = req.params;
    const events = await getBeerPongEvents(gameId);
    res.json(events);
  } catch (error) {
    console.error('Error fetching beer pong events:', error);
    res.status(500).json({ error: 'Failed to fetch beer pong events' });
  }
});

// Get beer pong game session (events + current state)
router.get('/games/:gameId/session', async (req, res) => {
  try {
    const { gameId } = req.params;
    const session = await getBeerPongGameSession(gameId);
    res.json(session);
  } catch (error) {
    console.error('Error fetching beer pong game session:', error);
    res.status(500).json({ error: 'Failed to fetch beer pong game session' });
  }
});

// Get latest commentary for a game
router.get('/games/:gameId/commentary/latest', async (req, res) => {
  try {
    const { gameId } = req.params;
    const commentary = await getLatestCommentary(gameId);
    res.json(commentary);
  } catch (error) {
    console.error('Error fetching latest commentary:', error);
    res.status(500).json({ error: 'Failed to fetch latest commentary' });
  }
});

// Reset beer pong game (delete all events)
router.delete('/games/:gameId/events', async (req, res) => {
  try {
    const { gameId } = req.params;
    await resetBeerPongGame(gameId);
    res.json({ message: 'Beer pong game reset successfully' });
  } catch (error) {
    console.error('Error resetting beer pong game:', error);
    res.status(500).json({ error: 'Failed to reset beer pong game' });
  }
});

// Get beer pong statistics for a player
router.get('/players/:playerId/stats', async (req, res) => {
  try {
    const { playerId } = req.params;
    const stats = await getPlayerBeerPongStats(playerId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching player beer pong stats:', error);
    res.status(500).json({ error: 'Failed to fetch player beer pong stats' });
  }
});

export default router;
