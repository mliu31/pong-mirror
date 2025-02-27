// Fetches appropriate data for leaderboard depending on tab

import Player from '../../models/Player';
//import mongoose from 'mongoose';

export interface LeaderboardItem {
  userID: number;
  name: string;
  score: number;
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
    .select('userID name score rank')
    .lean();
  return players as LeaderboardItem[];
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
    .select('userID name score rank')
    .lean();
  return players as LeaderboardItem[];
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
export async function fetchLeagueLeaderboard(userId: number): Promise<{
  players: LeaderboardItem[];
  currentUser?: LeaderboardItem;
}> {
  // Retrieve current player rank
  const currentPlayer = await Player.findOne({ userID: userId })
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
  const currentUser = players.find((player) => player.userID === userId);
  return { players, currentUser };
}

/**
 * Aggregate function that fetches all leaderboards
 */
export async function fetchLeaderboard(tab: 'Top' | 'League', userId: number) {
  if (tab === 'Top') {
    return fetchTopLeaderboard;
  } else {
    return fetchLeagueLeaderboard(userId);
  }
}
