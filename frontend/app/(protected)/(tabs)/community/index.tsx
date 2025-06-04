import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import AddButton from '../../../../components/private-leaderboards/addButton';
import TitleDiv from './[playerid]/titleDiv';
import FriendBox from './[playerid]/friendBox';
import GroupBox from './[playerid]/groupBox';
import { ThemedText } from '@/components/ThemedText';

import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';
import { getPlayer } from '@/api/players';
import { IPlayer, IGroup } from '@/api/types';

import { getFriends, addFriend, removeFriend } from '@/api/friends';

import {
  getGroup,
  createGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
  getAllGroups
} from '@/api/groups';

export default function CommunityLandingScreen() {
  // Get current user's ID from auth hook
  const loggedIn = useLoggedInPlayer(); // e.g. { _id: "63fa...", name: "...", ... } or null
  const playerId = loggedIn?._id;

  // Local state
  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [loadingPlayer, setLoadingPlayer] = useState<boolean>(true);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const [friends, setFriends] = useState<IPlayer[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState<string>('');

  const [allGroups, setAllGroups] = useState<IGroup[]>([]);
  const [loadingAllGroups, setLoadingAllGroups] = useState<boolean>(true);
  const [allGroupsError, setAllGroupsError] = useState<string | null>(null);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<IPlayer[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  // Fetch  full player document
  useEffect(() => {
    if (!playerId) {
      setLoadingPlayer(false);
      setPlayerError('No logged-in user found.');
      return;
    }

    getPlayer(playerId)
      .then((resp) => {
        setPlayer(resp.data);
        setLoadingPlayer(false);
      })
      .catch((err) => {
        if (err instanceof Error) {
          console.error('Error fetching player:', err.message);
          setPlayerError('Failed to load your profile: ' + err.message);
        } else {
          console.error('Non-error thrown when fetching player:', err);
          setPlayerError('Failed to load your profile.');
        }
        setLoadingPlayer(false);
      });
  }, [playerId]);

  // Once we have player, fetch friends & groups
  useEffect(() => {
    if (player === null) return;

    // Fetch friends
    (async () => {
      try {
        if (player.friends && player.friends.length > 0) {
          const friendList = await getFriends(player.friends);
          setFriends(friendList);
        } else {
          setFriends([]);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error loading friends:', err.message);
          Alert.alert('Failed to load friends', err.message);
        } else {
          console.error('Unexpected error loading friends:', err);
          Alert.alert('Failed to load friends', 'Unknown error occurred');
        }
      }
    })();

    // Fetch groups
    (async () => {
      try {
        if (player.groups && player.groups.length > 0) {
          const fetched: IGroup[] = [];
          for (const gid of player.groups) {
            const grp = (await getGroup(gid)) as IGroup;
            fetched.push(grp);
          }
          setGroups(fetched);
        } else {
          setGroups([]);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error loading groups:', err.message);
          Alert.alert('Failed to load groups', err.message);
        } else {
          console.error('Unexpected error loading groups:', err);
          Alert.alert('Failed to load groups', 'Unknown error occurred');
        }
      }
    })();
  }, [player]);

  // fetch all groups
  useEffect(() => {
    (async () => {
      try {
        const fetchedAll = await getAllGroups();
        setAllGroups(fetchedAll);
        setLoadingAllGroups(false);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Error loading all groups:', msg);
        setAllGroupsError('Failed to load all groups: ' + msg);
        setLoadingAllGroups(false);
      }
    })();
  }, []);

  // Handlers for adding/removing friends
  const handleAddFriend = async (friendId: string) => {
    if (!playerId) return;
    try {
      await addFriend(playerId, friendId);
      if (player && player.friends) {
        const updatedFriends = await getFriends([...player.friends, friendId]);
        setFriends(updatedFriends);
        setPlayer((prev) =>
          prev ? { ...prev, friends: [...prev.friends, friendId] } : prev
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error adding friend:', err.message);
        Alert.alert('Could not add friend', err.message);
      } else {
        console.error('Unexpected error adding friend:', err);
        Alert.alert('Could not add friend', 'Unknown error occurred');
      }
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!playerId) return;
    try {
      await removeFriend(playerId, friendId);
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
      setPlayer((prev) =>
        prev
          ? { ...prev, friends: prev.friends.filter((id) => id !== friendId) }
          : prev
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error removing friend:', err.message);
        Alert.alert('Could not remove friend', err.message);
      } else {
        console.error('Unexpected error removing friend:', err);
        Alert.alert('Could not remove friend', 'Unknown error occurred');
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!playerId || !newGroupName.trim()) {
      Alert.alert('Group name cannot be empty');
      return;
    }
    try {
      const created = await createGroup(playerId, newGroupName.trim());
      setGroups((prev) => [...prev, created]);
      setPlayer((prev) =>
        prev ? { ...prev, groups: [...prev.groups, created._id] } : prev
      );
      setNewGroupName('');
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error creating group:', err.message);
        Alert.alert('Could not create group', err.message);
      } else {
        console.error('Unexpected error creating group:', err);
        Alert.alert('Could not create group', 'Unknown error occurred');
      }
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // 1) Call API to delete from backend
      await deleteGroup(groupId);

      // If this group was expanded, collapse it and clear members:
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
        setGroupMembers([]);
        setMembersError(null);
      }

      // 2) Remove from “My Groups” state
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      setPlayer((prev) =>
        prev
          ? { ...prev, groups: prev.groups.filter((id) => id !== groupId) }
          : prev
      );

      // ── NEW: Remove from “All Groups” state so it disappears immediately
      setAllGroups((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unknown error deleting group';
      console.error('Error deleting group:', msg);
      Alert.alert('Failed to delete group', msg);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!playerId) return;
    try {
      const updated = await joinGroup(playerId, groupId);
      setPlayer((prev) =>
        prev ? { ...prev, groups: [...prev.groups, groupId] } : prev
      );
      setGroups((prev) => {
        const already = prev.find((g) => g._id === updated._id);
        if (already) {
          return prev.map((g) => (g._id === updated._id ? updated : g));
        } else {
          return [...prev, updated];
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error joining group:', err.message);
        Alert.alert('Could not join group', err.message);
      } else {
        console.error('Unexpected error joining group:', err);
        Alert.alert('Could not join group', 'Unknown error occurred');
      }
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!playerId) return;

    try {
      // 1) Call the API so the backend removes you from that group
      const updated: IGroup = await leaveGroup(playerId, groupId);

      // 2) Remove groupId from player.groups
      setPlayer((prev) =>
        prev
          ? { ...prev, groups: prev.groups.filter((id) => id !== groupId) }
          : prev
      );

      // 3) Remove the group from your “My Groups” list
      setGroups((prev) =>
        prev
          .map((g) => (g._id === updated._id ? updated : g))
          .filter((g) => g._id !== groupId)
      );

      // ── 4) **Ensure this group exists in allGroups** so that the filter can pass.
      setAllGroups((prev) => {
        const alreadyPresent = prev.find((g) => g._id === updated._id);
        if (alreadyPresent) {
          // If it’s already in state, just update its data (e.g. .members, .name, etc.)
          return prev.map((g) => (g._id === updated._id ? updated : g));
        } else {
          // Otherwise append it back to allGroups
          return [...prev, updated];
        }
      });

      // 5) If that group was expanded (showing members), collapse it
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
        setGroupMembers([]);
        setMembersError(null);
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unknown error leaving group';
      console.error('Error leaving group:', msg);
      Alert.alert('Could not leave group', msg);
    }
  };

  const handleSelectGroup = async (groupId: string) => {
    // 1) If you tap the same group twice, “toggle” it closed:
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
      setGroupMembers([]);
      setMembersError(null);
      return;
    }

    // 2) Otherwise, open this group and fetch its members
    setSelectedGroupId(groupId);
    setLoadingMembers(true);
    setMembersError(null);

    try {
      // Fetch the up‐to‐date group object (so you can read its `members: string[]`)
      const grp: IGroup = await getGroup(groupId);

      if (!grp.members || grp.members.length === 0) {
        setGroupMembers([]);
      } else {
        // Assuming `getFriends` can take an array of player IDs and return IPlayer[]
        const membersList = await getFriends(grp.members);
        // Sort by descending Elo:
        const sorted = [...membersList].sort((a, b) => b.elo - a.elo);
        setGroupMembers(sorted);
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unknown error fetching members';
      console.error('[Community] Error loading members for group:', msg);
      setMembersError('Failed to load group members: ' + msg);
      setGroupMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Render loading/error states
  if (loadingPlayer) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (playerError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{playerError}</Text>
      </View>
    );
  }
  if (!player) {
    // Shouldn’t happen once we've handled loading & error, but just in case
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No user data available.</Text>
      </View>
    );
  }

  // Main UI
  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TitleDiv />
        </View>

        {/* Friends */}
        <View style={styles.section}>
          <AddButton
            category="Friends"
            playerId={player?._id}
            friendIds={player?.friends}
          />

          {friends.length === 0 ? (
            <Text style={styles.emptyText}>You have no friends yet.</Text>
          ) : (
            [...friends]
              .sort((a, b) => b.elo - a.elo)
              .map((f, idx) => (
                <FriendBox
                  key={f._id}
                  rank={idx + 1}
                  name={f.name}
                  elo={f.elo}
                />
              ))
          )}
        </View>

        {/* ─── “My Groups” Section ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          {/* 1) Section Title */}
          <ThemedText style={styles.sectionTitle}>My Groups</ThemedText>

          {/* 2) Create New Group Bar */}
          <View style={styles.newGroupRow}>
            <TextInput
              style={styles.textInput}
              placeholder="New Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateGroup}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>

          {/* 3) If no groups, show empty text */}
          {groups.length === 0 ? (
            <Text style={styles.emptyText}>You’re not in any groups yet.</Text>
          ) : (
            /* 4) Otherwise, loop through each group and render: 
         - Left side: group name + toggle
         - Right side: Delete & Leave buttons
         - Below: expanded member list (if selected) */
            groups.map((grp) => {
              const isExpanded = selectedGroupId === grp._id;
              return (
                <View key={grp._id} style={{ marginBottom: 4 }}>
                  <View style={styles.itemRow}>
                    {/* a) Expand/Collapse Touchable (takes up flex: 1) */}
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                      onPress={() => handleSelectGroup(grp._id)}
                    >
                      <GroupBox groupName={grp.name} />
                      <Text
                        style={{
                          marginLeft: 8,
                          fontSize: 16,
                          color: '#007AFF'
                        }}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </Text>
                    </TouchableOpacity>

                    {/* b) Delete Button */}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteGroup(grp._id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>

                    {/* c) Leave Button */}
                    <TouchableOpacity
                      style={styles.leaveButton}
                      onPress={() => handleLeaveGroup(grp._id)}
                    >
                      <Text style={styles.leaveButtonText}>Leave</Text>
                    </TouchableOpacity>
                  </View>

                  {/* d) Expanded member list, only if isExpanded === true */}
                  {isExpanded && (
                    <View style={styles.membersContainer}>
                      {loadingMembers ? (
                        <ActivityIndicator size="small" color="#007AFF" />
                      ) : membersError ? (
                        <Text style={styles.errorText}>{membersError}</Text>
                      ) : groupMembers.length === 0 ? (
                        <Text style={styles.emptyText}>
                          No members in this group.
                        </Text>
                      ) : (
                        groupMembers.map((pl, idx) => (
                          <View key={pl._id} style={styles.memberRow}>
                            <Text style={styles.memberRank}>{idx + 1}.</Text>
                            <Text style={styles.memberName}>{pl.name}</Text>
                            <Text style={styles.memberElo}>{pl.elo}</Text>
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
        {/* ─────────────────────────────────────────────────────────────────────────────── */}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>All Groups</ThemedText>

          {/* Loading spinner */}
          {loadingAllGroups ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : null}

          {/* Error text */}
          {allGroupsError ? (
            <Text style={[styles.errorText, { fontSize: 14, marginTop: 8 }]}>
              {allGroupsError}
            </Text>
          ) : null}

          {/* Once loaded, list every group */}
          {!loadingAllGroups && !allGroupsError ? (
            allGroups.length === 0 ? (
              <Text style={styles.emptyText}>No groups available.</Text>
            ) : (
              allGroups
                .filter((grp) => !player?.groups?.includes(grp._id))
                .map((grp) => (
                  <View key={grp._id} style={styles.itemRow}>
                    <GroupBox groupName={grp.name} />
                    <TouchableOpacity
                      style={styles.joinButton}
                      onPress={() => handleJoinGroup(grp._id)}
                    >
                      <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                  </View>
                ))
            )
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  errorText: {
    color: '#B00020',
    fontSize: 16
  },

  header: {
    marginBottom: 24
  },

  section: {
    marginBottom: 32
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 25,
    paddingLeft: Dimensions.get('window').height / 20,
    paddingRight: Dimensions.get('window').height / 20,
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
    marginBottom: 20
  },

  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },

  removeButton: {
    marginLeft: 12,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '500'
  },

  // Group creation row
  newGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 20,
    marginLeft: 12,
    marginRight: 12
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  createButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600'
  },

  deleteButton: {
    marginLeft: 12,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '500'
  },

  leaveButton: {
    marginLeft: 8,
    backgroundColor: '#FF9500',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  leaveButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  joinButton: {
    marginLeft: 12,
    backgroundColor: '#34C759', // green to indicate “join”
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '500'
  },

  joinedButton: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  joinedButtonText: {
    color: '#444',
    fontWeight: '500'
  },
  membersContainer: {
    marginLeft: 16,
    marginTop: 4,
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  memberRank: {
    width: 24,
    fontWeight: '600',
    fontSize: 14
  },
  memberName: {
    flex: 1,
    fontSize: 16
  },
  memberElo: {
    width: 50,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '500'
  }
});
