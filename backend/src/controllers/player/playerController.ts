import Player from '../../models/Player';

export const getAllPlayers = () => Player.find();
