import Group from '../../models/Group';
import Player from '../../models/Player';

// get private groups

export const getGroup = async (groupId: string) => Group.find(groupId);

// create a private group

export const createGroup = (groupName: string, playerId: string) =>
  Group.create({
    name: groupName,
    members: [playerId]
  });

// join a private group

export const joinGroup = (playerId: string, groupId: string) => {
  const group = Group.findById(groupId);
  if (group === null) throw new Error('Group not found');

  // check if the person exists

  // check if the person is already in the group

  // add them to the array on group side

  // for the player, add the group to their side

  
}


// leave a private group
