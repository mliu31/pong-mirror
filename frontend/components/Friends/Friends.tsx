import FriendList from './FriendList';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import { getPlayer } from '@/api/players';
import { ThemedView } from '@/components/ThemedView';

const Friends = ({ pid }: { pid: string }) => {
  // friend ids state
  const [friends, setFriends] = useState<string[]>([]);

  // on page load, fetch friend ids
  useEffect(() => {
    const fetchFriends = async () => {
      const player = await getPlayer(pid);
      setFriends(player.data.friends);
    };
    fetchFriends();
  }, [pid]);

  // route to edit friends page
  const EditFriendHandler = (fids: string[], pid: string) => {
    router.push({
      pathname: '/profile/EditFriends',
      params: { friendIds: JSON.stringify(fids), pid: pid }
    });
  };

  return (
    <ThemedView className="w-full rounded-2xl p-4 mb-4">
      <Text className="text-lg font-bold mb-2 text-white dark:text-white">
        Friends
      </Text>
      <FriendList fids={friends} />
      <Button
        onPress={() => EditFriendHandler(friends, pid)}
        title="Edit Friends"
      />
    </ThemedView>
  );
};

export default Friends;
