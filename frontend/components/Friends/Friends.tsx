import FriendList from './FriendList';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { getPlayer } from '@/api/players';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';

const Friends = ({ pid }: { pid: string }) => {
  // friend ids state
  const [friends, setFriends] = useState<string[]>([]);

  // on page load, fetch friend ids
  useFocusEffect(
    useCallback(() => {
      const fetchFriends = async () => {
        const player = await getPlayer(pid);
        setFriends(player.data.friends);
      };
      fetchFriends();
    }, [pid])
  );

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
      <Box className="items-center">
        <Button
          className="mt-4"
          onPress={() => EditFriendHandler(friends, pid)}
        >
          <ButtonText>Edit friends</ButtonText>
        </Button>
      </Box>
    </ThemedView>
  );
};

export default Friends;
