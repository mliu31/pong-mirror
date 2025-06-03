import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { IPlayer } from '@/api/types';
import { getFriends } from '@/api/friends';
import { ThemedView } from '@/components/ThemedView';

const FriendList = ({ fids }: { fids: string[] }) => {
  const [friends, setFriends] = useState<IPlayer[]>([]);

  useEffect(() => {
    getFriends(fids).then((res) => setFriends(res));
  }, [fids]);

  return friends.map((friend) => (
    <ThemedView
      key={friend._id}
      className="py-1 px-2 rounded-md bg-transparent"
    >
      <Text className="text-sm text-black dark:text-white">{friend.name}</Text>
      {/* <Text className="text-xs text-gray-600 dark:text-gray-400">{friend.elo}</Text> */}
    </ThemedView>
  ));
};

export default FriendList;
