import Player from '../../models/Player';

export const getAllPlayers = () => Player.find();

export const getPlayer = (pid: string) => Player.findById(pid);
