import api from '.';
import { Player } from './types';

export const getAllPlayers = () => api.get<Player>(`/players`);

export const getPlayer = (pid: string) => api.get<Player>(`/players/${pid}`);
