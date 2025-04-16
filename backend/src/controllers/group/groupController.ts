import Group from '../../models/Group';
import Player from '../../models/Player';

// get private groups

export const getGroup = (groupId: string) => Group.findById(groupId);

// create a private group

export const createGroup = (groupName: string, playerId: string) => {
  const group = Group.create({
    name: groupName,
    members: [playerId]
  });
  return group;
};

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

  if (!player.groups.includes(groupId) || !group.members.includes(playerId))
    throw new Error('Player is not in Group');

  const playerIndex = player.groups.indexOf(groupId, 0);
  if (playerIndex > -1) {
    player.groups.splice(playerIndex, 1);
  }
  player.save();

  const groupIndex = group.members.indexOf(playerId, 0);
  if (groupIndex > -1) {
    group.members.splice(groupIndex, 1);
  }
  group.save();

  return group;
};

export const deleteGroup = async (groupId: string) => {
  const group = await Group.findById(groupId);

  if (group == null) throw new Error('Group not found');

  for (const pid of group.members) {
    const player = await Player.findById(pid);

    if (player == null) throw new Error('Player not found');
    const playerIndex = player.groups.indexOf(groupId, 0);
    if (playerIndex > -1) {
      player.groups.splice(playerIndex, 1);
    }
    player.save();
  }

  const deleted = Group.findByIdAndDelete(groupId);
  return deleted;
};
