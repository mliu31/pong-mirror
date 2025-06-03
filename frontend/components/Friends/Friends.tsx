import FriendList from './FriendList';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
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
      <FriendList fids={friends} />
      <Button
        className="mt-4 self-start"
        onPress={() => EditFriendHandler(friends, pid)}
      >
        <ButtonText>Edit Friends</ButtonText>
      </Button>
    </ThemedView>
  );
};

export default Friends;
