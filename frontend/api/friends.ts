import api from '.';
import { Player } from './types';
import { getAllPlayers } from './players';

export const getFriends = async (friendIds: string[]) => {
  const allPlayers = await getAllPlayers();
  return allPlayers.data.filter((p) => friendIds.includes(p._id));
};

export const getNonFriends = async (friendIds: string[]) => {
  const allPlayers = await api.get<Player[]>('/players');
  return allPlayers.data.filter((p) => !friendIds.includes(p._id));
};
