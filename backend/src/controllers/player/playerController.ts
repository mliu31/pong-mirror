import Player from '../../models/Player';

export const getAllPlayers = () => Player.find();

export const getPlayer = (pid: string) => Player.findById(pid);
export const addPlayerFriend = async (pid: string, fid: string) => {
  const player = await getPlayer(pid);
  const friend = await getPlayer(fid);

  if (!player) {
    throw new Error(`Player with ID ${pid} not found`);
  }

  if (!friend) {
    throw new Error(`Friend with ID ${fid} not found`);
  }

  const updatedPlayer = await Player.findByIdAndUpdate(
    pid,
    { $addToSet: { friends: fid } },
    { new: true }
  );

  return updatedPlayer;
};

export const removePlayerFriend = async (pid: string, fid: string) => {
  const player = await getPlayer(pid);
  const friend = await getPlayer(fid);

  if (!player) {
    throw new Error(`Player with ID ${pid} not found`);
  }

  if (!friend) {
    throw new Error(`Friend with ID ${fid} not found`);
  }

  const updatedPlayer = await Player.findByIdAndUpdate(
    pid,
    { $pull: { friends: fid } },
    { new: true }
  );

  return updatedPlayer;
};
