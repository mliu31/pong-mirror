import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Player } from '@/api/types';
import { getFriends } from '@/api/friends';

const FriendList = ({ fids }: { fids: string[] }) => {
  const [friends, setFriends] = useState<Player[]>([]);

  useEffect(() => {
    getFriends(fids).then((res) => setFriends(res));
  }, [fids]);

  return friends.map((friend) => (
    <View key={friend._id}>
      <Text style={styles.nameContainer}>{friend.name}</Text>
      {/* <Text style={styles.scoreContainer}>{friend.elo}</Text> */}
    </View>
  ));
};

const styles = StyleSheet.create({
  nameContainer: {
    flex: 2
  },
  scoreContainer: {
    flex: 2
  }
});

export default FriendList;
