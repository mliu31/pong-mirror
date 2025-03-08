import FriendList from './FriendList';
import { router, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { getPlayer } from '@/api/players';

const Friends = ({ pid }: { fids: string[]; pid: string }) => {
  // friend ids state
  const [friends, setFriends] = useState<string[]>([]);

  // on page load, fetch friend ids
  useFocusEffect(() => {
    const fetchFriends = async () => {
      const player = await getPlayer(pid);
      setFriends(player.data.friends);
    };
    fetchFriends();
  });

  // route to edit friends page
  const EditFriendHandler = (fids: string[], pid: string) => {
    router.push({
      pathname: '/profile/EditFriends',
      params: { friendIds: JSON.stringify(fids), pid: pid }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FriendList fids={friends} />
      <Button
        onPress={() => EditFriendHandler(friends, pid)}
        title="Edit Friends"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default Friends;
