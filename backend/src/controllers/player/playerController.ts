import Player from '../../models/Player';

export const getAllPlayers = () => Player.find();

export const getPlayer = (pid: string) => Player.findById(pid);

export const addFriend = async (playerId: string, friendId: string) => {
  const friend = await Player.findById(friendId);
  if (!friend) {
    throw new Error('Friend not found');
  }
  return Player.findByIdAndUpdate(
    playerId,
    { $push: { friends: friendId } },
    { new: true } // Return the updated document
  );
};
