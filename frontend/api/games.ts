import api from '.';

export const createGame = async () => await api.post('/games');
export const getGame = async (gameid: string) =>
  await api.get(`/games/${gameid}`);
