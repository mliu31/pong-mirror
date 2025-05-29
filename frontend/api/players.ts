import api from '.';
import { IPlayer } from './types';

export const getAllPlayers = () => api.get<IPlayer[]>(`/players`);

export const getPlayer = (pid: string) => api.get<IPlayer>(`/players/${pid}`);
