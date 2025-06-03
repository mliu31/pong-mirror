import { TeamValue } from '@/constants/TEAM';
import api from '.';
import { IGame } from './types';

export const createGame = async () => await api.post('/games');

export const getGame = async (gameid: string) =>
  await api.get<IGame>(`/games/${gameid}`);

export const addPlayersToGame = async (gameid: string, pids: string[]) =>
  await api.patch(`/games/${gameid}/players`, pids);

export const updatePlayerTeam = async (
  pid: string,
  team: TeamValue,
  gameid: string
) => await api.put(`/games/${gameid}/players/${pid}/team/${team}`);

export const updateElo = async (gameId: string, winningColor: string) =>
  await api.patch(`/games/${gameId}/winningColor/${winningColor}`);

export const setGameWinner = async (gameId: string, team: TeamValue) =>
  await api.patch(`/games/${gameId}/winner/${team}`);

export const getGameHistory = async (playerId: string) =>
  await api.get<IGame[]>(`/games/player/${playerId}`);
