import api from '.';

export const createGame = async () => await api.post('/games');
