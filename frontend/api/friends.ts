import api from '.';
import { getAllPlayers } from './players';

export const getFriends = async (friendIds: string[]) => {
  const allPlayers = await getAllPlayers();
  return allPlayers.data.filter((p) => friendIds.includes(p._id));
};

export const addFriend = async (playerid: string, friendId: string) => {
  api.put(`/players/${playerid}/friend/${friendId}`);
};

export const removeFriend = async (playerid: string, friendId: string) => {
  api.delete(`/players/${playerid}/friend/${friendId}`);
};
