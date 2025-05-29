import { InviteValue } from '@/constants/INVITE';
import { IInvite } from './types';
import api from '.';

export const invitePlayersToGame = async (gameid: string, pids: string[]) =>
  await api.put(`/invite/game/${gameid}/`, pids);

export const getGameInvites = async (gameid: string) =>
  await api.get<IInvite[]>(`/invite/game/${gameid}`);

export const getPlayerInvites = async (pid: string) =>
  await api.get<IInvite[]>(`invite/player/${pid}`);

export const setPlayerInvite = async (
  pid: string,
  gameid: string,
  status: InviteValue
) => await api.put(`invite/player/${pid}/game/${gameid}/status/${status}`);
