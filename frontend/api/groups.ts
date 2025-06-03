import api from '.';

export const getGroup = async (groupId: string) => {
  const response = await api.get(`/group/${groupId}`);
  return response.data;
};

export const createGroup = async (playerId: string, groupName: string) => {
  // Note: groupName should be URL-encoded if it has spaces/special chars
  const encodedName = encodeURIComponent(groupName);
  const response = await api.put(`/group/addGroup/${playerId}/${encodedName}`);
  return response.data;
};

export const joinGroup = async (playerId: string, groupId: string) => {
  const response = await api.patch(`/group/addPlayer/${groupId}/${playerId}`);
  return response.data;
};

export const leaveGroup = async (playerId: string, groupId: string) => {
  const response = await api.patch(
    `/group/removePlayer/${groupId}/${playerId}`
  );
  return response.data;
};

export const deleteGroup = async (groupId: string) => {
  const response = await api.delete(`/group/deleteGroup/${groupId}`);
  return response.data;
};
