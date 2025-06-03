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

import AddButton from '../../../../components/private-leaderboards/addButton';
import TitleDiv from './[playerid]/titleDiv';
import FriendBox from './[playerid]/friendBox';
import GroupBox from './[playerid]/groupBox';

import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';
import { getPlayer } from '@/api/players';
import { IPlayer, IGroup } from '@/api/types';

import { getFriends, addFriend, removeFriend } from '@/api/friends';

import {
  getGroup,
  createGroup,
  joinGroup,
  leaveGroup,
  deleteGroup
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
      await deleteGroup(groupId);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      setPlayer((prev) =>
        prev
          ? { ...prev, groups: prev.groups.filter((id) => id !== groupId) }
          : prev
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error deleting group:', err.message);
        Alert.alert('Failed to delete group', err.message);
      } else {
        console.error('Unexpected error deleting group:', err);
        Alert.alert('Failed to delete group', 'Unknown error occurred');
      }
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
      const updated = await leaveGroup(playerId, groupId);
      setPlayer((prev) =>
        prev
          ? { ...prev, groups: prev.groups.filter((id) => id !== groupId) }
          : prev
      );
      setGroups((prev) =>
        prev
          .map((g) => (g._id === updated._id ? updated : g))
          .filter((g) => g._id !== groupId)
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error leaving group:', err.message);
        Alert.alert('Could not leave group', err.message);
      } else {
        console.error('Unexpected error leaving group:', err);
        Alert.alert('Could not leave group', 'Unknown error occurred');
      }
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Friends</Text>
            <AddButton category="Friends" />
          </View>

          {friends.length === 0 ? (
            <Text style={styles.emptyText}>You have no friends yet.</Text>
          ) : (
            friends.map((f, idx) => (
              <View key={f._id} style={styles.itemRow}>
                <FriendBox rank={idx + 1} name={f.name} elo={f.elo} />
              </View>
            ))
          )}
        </View>

        {/* Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Groups</Text>

          {/* ▸ CREATE NEW GROUP ROW ▸ */}
          <View style={styles.newGroupRow}>
            <TextInput
              style={styles.textInput}
              placeholder="New group name"
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

          {groups.length === 0 ? (
            <Text style={styles.emptyText}>You’re not in any groups yet.</Text>
          ) : (
            groups.map((grp) => (
              <View key={grp._id} style={styles.itemRow}>
                <GroupBox groupName={grp.name} />

                {/* Example: “Delete” and “Leave”—add “Join” if desired */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteGroup(grp._id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.leaveButton}
                  onPress={() => handleLeaveGroup(grp._id)}
                >
                  <Text style={styles.leaveButtonText}>Leave</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff'
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
    fontSize: 20,
    fontWeight: '600'
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
    marginTop: 8
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
  }
});
