import api from '.';
import { Player } from './types';

export const getAllPlayers = () => api.get<Player>(`/players`);

export const getPlayer = (pid: string) => api.get<Player>(`/players/${pid}`);

export async function addFriend(
  playerId: string,
  friendId: string
): Promise<Player> {
  const response = await fetch(`/players/${playerId}/friends`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ friendId })
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Failed to add friend');
  }

  return response.json();
}
