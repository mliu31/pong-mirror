import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Player } from '@/api/types';
import { getFriends } from '@/api/friends';

const FriendList = ({ fids }: { fids: string[] }) => {
  const [friends, setFriends] = useState<Player[]>([]);

  useEffect(() => {
    getFriends(fids).then((res) => setFriends(res));
  }, [fids]);

  return friends.map((friend) => (
    <View key={friend._id}>
      <Text>{friend.name}</Text>
    </View>
  ));
};

export default FriendList;
