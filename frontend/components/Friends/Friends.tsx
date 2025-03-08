import { Player } from '@/api/types';
import FriendList from './FriendList';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';

const Friends = ({ fids, pid }: { fids: string[]; pid: string }) => {
  const [friends, setFriends] = useState<Player[]>();

  // useEffect = () => {

  // } []

  const EditFriendHandler = (fids: string[], pid: string) => {
    router.push({
      pathname: '/profile/EditFriends',
      params: { friendIds: JSON.stringify(fids), pid: pid }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FriendList fids={fids} />
      <Button
        onPress={() => EditFriendHandler(fids, pid)}
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
