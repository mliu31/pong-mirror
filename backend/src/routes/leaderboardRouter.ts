import express from 'express';
import { RequestHandler } from 'express';
import Player from '../models/Player';
import { updateRanks } from '../controllers/leaderboard/rankingCurrent';
import { fetchLeaderboard } from '../controllers/leaderboard/leaderboardFetch';

void Player;

const router = express.Router();

/**
 * Recalculates and updates the ranks for all players.
 */
router.post('/update-ranks', async (_, res) => {
  try {
    await updateRanks();
    res.status(200).json({ message: 'Ranks updated successfully.' });
  } catch (error) {
    console.error('Error updating ranks:', error);
    res.status(500).json({ error: 'Failed to update ranks.' });
  }
});

/**
 * Fetches leaderboard data based on selected tab
 */
router.get('/', (async (req, res) => {
  try {
    const tab = req.query.tab as 'Top' | 'League';
    const userIdParam = req.query.userId as string;
    if (!tab || !userIdParam) {
      return res
        .status(400)
        .json({ error: 'Missing required query parameters: tab, userId' });
    }
    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ error: 'Invalid userId, must be a number.' });
    }

    const leaderboardData = await fetchLeaderboard(tab, userId);
    res.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
}) as RequestHandler);

export default router;
