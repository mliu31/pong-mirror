import api from '.';
import { Player } from './types';

export const getAllPlayers = () => api.get<Player[]>(`/players`);
