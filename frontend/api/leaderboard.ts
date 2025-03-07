import api from '.';

// Define the shape of the API response from the backend
interface LeaderboardResponse {
  players: {
    userID: number;
    name: string;
    elo: number;
    rank: number;
  }[];
}

interface UpdateRanksResponse {
  message: string;
}

/**
 * Fetches leaderboard data from the backend API
 */
export const fetchLeaderboard = async (
  tab: 'Top' | 'League',
  userId: number
): Promise<LeaderboardResponse> => {
  try {
    const { data } = await api.get<LeaderboardResponse>('/leaderboard', {
      params: { tab, userId }
    });
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

/**
 * Triggers a recalculation of all player ranks
 */
export const updateRanks = async (): Promise<UpdateRanksResponse> => {
  try {
    const { data } = await api.post<UpdateRanksResponse>(
      '/leaderboard/update-ranks'
    );
    return data;
  } catch (error) {
    console.error('Error updating ranks:', error);
    throw error;
  }
};
