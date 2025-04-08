import Player from '../../models/Player';

export const getAllPlayers = () => Player.find();

export const getPlayer = (pid: string) => Player.findById(pid);

export const getFriends = (pid: string) => {
  const toReturn = Player.findById(pid);
  return toReturn.friends;
};

export const getPlayerGroup = async (pid: string): Promise<string[]> => {
  const player = await Player.findById(pid);
  if (!player) {
    throw new Error('Player not found');
  }
  return player.groups;
};
