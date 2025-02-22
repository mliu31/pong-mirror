import api from '.';
import { Game } from './types';

export const createGame = async () => await api.post('/games');
export const getGame = async (gameid: string) =>
  await api.get<Game>(`/games/${gameid}`);

export const updatePlayerTeam = async (
  pid: string,
  team: string,
  gameid: string
) => await api.put(`/games/${gameid}/players/${pid}/team/${team}`);
