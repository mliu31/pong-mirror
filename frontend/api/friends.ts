import api from '.';
import { Player } from './types';

export const getFriends = async (friendIds: string[]) => {
  const friends = await Promise.all(
    friendIds.map((id) => api.get<Player>(`/players/${id}`))
  );

  return friends.map((f) => f.data);
};

export const getNonFriends = async (friendIds: string[]) => {
  const allPlayers = await api.get<Player[]>('/players');
  return allPlayers.data.filter((p) => !friendIds.includes(p._id));
};
