import { P } from '@expo/html-elements';
import api from '.';
import { Player, Game } from './types';

interface Team {
  _id: string;
  name: string;
  players: string[];
  elo: number;
  seed: number;
}

interface TournamentMatch {
  _id: string;
  team1: string | null;
  team2: string | null;
  winner: 'LEFT' | 'RIGHT' | null;
  bye: boolean;
  gameId: string;
}

// Define the shape of the API responses from the backend
export interface TournamentResponse {
  _id: string;
  name: string;
  teams: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  currentRound: number;
  admin: string;
  bracket: {
    round: number;
    matches: TournamentMatch[];
  }[];
}

/**
 * Creates a new tournament with the given name
 */
export const createTournament = async (
  name: string,
  adminId: string
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.put<TournamentResponse>(
      `/tournaments/createTournament/${name}`,
      { adminId }
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
    console.log(data);
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
  playerId: string,
  playerName: string
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.post<TournamentResponse>(
      `/tournaments/addTeam/${tournamentId}/teams/${playerId}`,
      { playerName }
    );
    return data;
  } catch (error) {
    console.error('Error adding team to tournament:', error);
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
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.post<TournamentResponse>(
      `/tournaments/addPlayer/${tournamentId}/teams/${teamId}/player/${playerId}`
    );
    return data;
  } catch (error) {
    console.error('Error adding player to team:', error);
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
 * Starts a tournament, creating the initial bracket and matches
 */
export const startTournament = async (
  tournamentId: string
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.post<TournamentResponse>(
      `/tournaments/${tournamentId}/start`
    );
    return data;
  } catch (error) {
    console.error('Error starting tournament:', error);
    throw error;
  }
};

export const getTeam = async (teamId: string): Promise<Team> => {
  try {
    const { data } = await api.get<Team>(`/tournaments/getTeam/${teamId}`);
    return data;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};

/**
 * Updates the winner of a match in a tournament
 */
export const updateMatchWinner = async (
  tournamentId: string,
  matchId: string,
  winningSide: 'LEFT' | 'RIGHT'
): Promise<TournamentResponse> => {
  try {
    const { data } = await api.put<TournamentResponse>(
      `/tournaments/updateMatchWinner/${tournamentId}/match/${matchId}/side/${winningSide}`
    );
    return data;
  } catch (error) {
    console.error('Error updating match winner:', error);
    throw error;
  }
};
