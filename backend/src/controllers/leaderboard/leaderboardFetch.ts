// Fetches appropriate data for leaderboard depending on tab

import Player from '../../models/Player';
import { Types } from 'mongoose';

export interface LeaderboardItem {
  _id: Types.ObjectId;
  name: string;
  elo: number;
  rank: number;
}

/**
 * Retrieves the top players sorted by rank
 * Limit: Max number to retrieve
 */
async function getTopPlayers(limit: number): Promise<LeaderboardItem[]> {
  const players = await Player.find({})
    .sort({ rank: 1 })
    .limit(limit)
    .select('_id name elo rank')
    .lean();

  // need to map to leaderboard structure
  return players.map((player) => ({
    _id: player._id as unknown as Types.ObjectId,
    name: player.name,
    elo: player.elo,
    rank: player.rank
  }));
}

/**
 * Retrieves players within a specified rank range.
 * startRank: The starting rank (inclusive).
 * endRank: The ending rank (inclusive).
 */
async function getPlayersInRankRange(
  startRank: number,
  endRank: number
): Promise<LeaderboardItem[]> {
  const players = await Player.find({
    rank: { $gte: startRank, $lte: endRank }
  })
    .sort({ rank: 1 })
    .select('_id name elo rank')
    .lean();

  return players.map((player) => ({
    _id: player._id as unknown as Types.ObjectId,
    name: player.name,
    elo: player.elo,
    rank: player.rank
  }));
}

/**
 * Fetch TOP leaderboard rankings
 * Returns top 20 players
 */
export async function fetchTopLeaderboard(): Promise<{
  players: LeaderboardItem[];
}> {
  const players = await getTopPlayers(20);
  return { players };
}

/**
 * Fetch the league leaderboard
 * Players surrounding current user ranking +- 10 are retrieved
 */
export async function fetchLeagueLeaderboard(userId: string): Promise<{
  players: LeaderboardItem[];
  currentUser?: LeaderboardItem;
}> {
  // Retrieve current player rank
  const objectId = new Types.ObjectId(userId); // ObjectId
  const currentPlayer = await Player.findOne({ _id: objectId })
    .select('rank')
    .lean();

  if (!currentPlayer) {
    throw new Error('User not found');
  }

  if (currentPlayer.rank === undefined || currentPlayer.rank === null) {
    throw new Error('User rank is not defined');
  }

  const userRank: number = currentPlayer.rank;
  const startRank = Math.max(userRank - 10, 1);
  const endRank = userRank + 10;

  const players = await getPlayersInRankRange(startRank, endRank);
  const currentUser = players.find((player) => player._id.equals(objectId));

  return { players, currentUser };
}

/**
 * Aggregate function that fetches all leaderboards
 */
export async function fetchLeaderboard(tab: 'Top' | 'League', userId: string) {
  if (tab === 'Top') {
    return await fetchTopLeaderboard();
  } else {
    return await fetchLeagueLeaderboard(userId);
  }
}
