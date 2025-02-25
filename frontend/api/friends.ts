import api from '.';
import { Player } from './types';

export const getFriends = async (friendIds: string[]) => {
  const friends = await Promise.all(
    friendIds.map((id) => api.get<Player>(`/players/${id}`))
  );

  return friends.map((f) => f.data);
};
