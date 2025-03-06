// Maintains current state of leaderboard
// TO DO: Add functionality to show same ranked players

import Player from '../../models/Player';

/**
 * Recalculates and updates the rank for all players based on score.
 */
export async function updateRanks(): Promise<void> {
  try {
    // Get all players sorted by elo in descending order
    const players = await Player.find().sort({ elo: -1 });

    // Simply assign ranks 1,2,3... based on sorted elo
    const updates = players.map((player, index) => ({
      updateOne: {
        filter: { _id: player._id },
        update: { $set: { rank: index + 1 } }
      }
    }));

    if (updates.length > 0) {
      await Player.bulkWrite(updates);
    }

    console.log('Rankings updated successfully');
  } catch (err) {
    console.error('Error updating ranks:', err);
    throw err;
  }
}
