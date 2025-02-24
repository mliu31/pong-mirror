// Maintains current state of leaderboard
// TO DO: Add functionality to show same ranked players

import Player from '../../models/Player';

/**
 * Recalculates and updates the rank for all players based on score.
 */
export async function updateRanks(): Promise<void> {
  try {
    // Retrieve all players sorted by score in descending order
    const players = await Player.find().sort({ score: -1 });
    // Update each player's rank (starting at 1)
    for (let i = 0; i < players.length; i++) {
      players[i].rank = i + 1;
      await players[i].save();
    }
    console.log('Leaderboard ranks updated.');
  } catch (err) {
    console.error('Error updating ranks:', err);
  }
}
