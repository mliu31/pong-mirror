import api from '.';

// Define the shape of the API responses from the backend
interface TournamentResponse {
  _id: string;
  name: string;
  teams: string[];
}

/**
 * Creates a new tournament with the given name
 */
export const createTournament = async (
  name: string
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.put<TournamentResponse>(
      `/tournaments/createTournament/${name}`
    );
    return data;
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
};

/**
 * Fetches a tournament by its ID
 */
export const getTournament = async (
  tournamentId: string
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.get<TournamentResponse>(
      `/tournaments/getTournament/${tournamentId}`
    );
    return data;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    throw error;
  }
};

/**
 * Deletes a tournament by its ID
 */
export const deleteTournament = async (tournamentId: string): Promise<void> => {
  try {
    await api.delete(`/tournaments/${tournamentId}`);
  } catch (error) {
    console.error('Error deleting tournament:', error);
    throw error;
  }
};

/**
 * Adds a team to a tournament
 */
export const addTeam = async (
  tournamentId: string,
  playerId: string
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.post<TournamentResponse>(
      `/tournaments/addTeam/${tournamentId}/teams/${playerId}`
    );
    return data;
  } catch (error) {
    console.error('Error adding team to tournament:', error);
    throw error;
  }
};

/**
 * Reseeds the teams in a tournament
 */
export const reseedTeams = async (
  tournamentId: string
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.put<TournamentResponse>(
      `/tournaments/${tournamentId}/seed`
    );
    return data;
  } catch (error) {
    console.error('Error reseeding tournament teams:', error);
    throw error;
  }
};

/**
 * Removes a team from a tournament
 */
export const removeTeam = async (
  tournamentId: string,
  teamId: string
): Promise<void> => {
  try {
    await api.delete(`/tournaments/removeTeam/${tournamentId}/teams/${teamId}`);
  } catch (error) {
    console.error('Error removing team from tournament:', error);
    throw error;
  }
};

/**
 * Gets all team IDs in a tournament
 */
export const getAllTeams = async (tournamentId: string): Promise<string[]> => {
  try {
    const { data } = await api.get<string[]>(
      `/tournaments/${tournamentId}/teams`
    );
    return data;
  } catch (error) {
    console.error('Error fetching tournament teams:', error);
    throw error;
  }
};

/**
 * Adds a player to a team in a tournament
 */
export const addPlayer = async (
  tournamentId: string,
  teamId: string,
  playerId: string
): Promise<void> => {
  try {
    await api.post(
      `/tournaments/${tournamentId}/teams/${teamId}/players/${playerId}`
    );
  } catch (error) {
    console.error('Error adding player to team:', error);
    throw error;
  }
};
