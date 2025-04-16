import Group from '../../models/Group';
import Player from '../../models/Player';
import { getPlayerGroup } from '../player/playerController';

// get private groups

export const getGroup = (groupId: string) => Group.findById(groupId);

// create a private group

export const createGroup = (groupName: string, playerId: string) => {
  const group = Group.create({
    name: groupName,
    members: [playerId]
  });
  return group;
}

// join a private group

export const joinGroup = async (playerId: string, groupId: string) => {
  const group = await Group.findById(groupId);
  const player = await Player.findById(playerId);

  if (group === null) throw new Error('Group not found');

  // check if the person exists

  if (player == null) throw new Error('Player not found');

  // check if the person is already in the group

  if (player.groups.includes(groupId) || group.members.includes(playerId))
    throw new Error('Already in group');

  // add them to the array on group side
  group.members.push(playerId);
  await group.save();
  player.groups.push(groupId);

  await player.save();

  return group;

  // for the player, add the group to their side
};

export const leaveGroup = async (playerId: string, groupId: string) => {
  const group = await Group.findById(groupId);
  const player = await Player.findById(playerId);

  if (group == null) throw new Error('Group not found');

  if (player == null) throw new Error('Player not found');

  if (!player.groups.includes(groupId) || group.members.includes(playerId))
    throw new Error('Already in group');

  // const playerIndex = player.groups.findIndex(groupId);
  // const x = player.groups.splice(playerIndex, 1);

  // const groupIndex = group.members.findIndex(playerId);
  // const y = group.members.splice(groupIndex, 1);

};

// leave a private group
