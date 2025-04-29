import Player from '../../models/Player';
import { updateRanks } from '../leaderboard/rankingCurrent';

// New player
export const newPlayer = async (name: string, email: string) => {
  const existingPlayer = await Player.findOne({ email });
  if (existingPlayer) {
    throw new Error('Player already exists');
  }

  // TODO: switch to using Mongo ids
  const lastPlayer = await Player.findOne().sort({ userID: -1 });
  let newPlayerID = 1;
  if (lastPlayer) {
    newPlayerID = lastPlayer.userID + 1;
  }

  const newPlayer = new Player({
    userID: newPlayerID, // TODO: remove
    name: name,
    email: email,
    friends: [],
    elo: 1000 // TODO: default? read from player model
  });
  updateRanks();
  await newPlayer.save();
  return newPlayer;
};

export const getAllPlayers = () => Player.find();

export const getPlayer = async (pid: string) => {
  const player = await Player.findById(pid);
  if (!player) {
    throw new Error(`Player with ID ${pid} not found`);
  }
  return player;
};

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

export const getPlayerGroup = async (pid: string): Promise<string[]> => {
  const player = await Player.findById(pid);
  if (!player) {
    throw new Error('Player not found');
  }
  return player.groups;
};
