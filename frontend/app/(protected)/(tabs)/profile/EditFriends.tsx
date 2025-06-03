import { getAllPlayers } from '@/api/players';
import { IPlayer } from '@/api/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import Checkbox from 'expo-checkbox';
import { addFriend, removeFriend } from '@/api/friends';

export default function EditFriend() {
  // read in params
  const { friendIds, pid } = useLocalSearchParams<{
    friendIds: string;
    pid: string;
  }>();

  // state for friend ids and sorted list of friends/nonfriends
  const [fids, setFids] = useState<Set<string>>(new Set());
  const [sortedPlayers, setSortedPlayers] = useState<IPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  // on page load
  useEffect(() => {
    if (!friendIds || !pid) {
      setLoading(false);
      return;
    }

    // update state of friend ids set
    const newFids = new Set(JSON.parse(friendIds) as string[]);
    setFids(newFids);

    //  sorts all players into friends and nonfriends
    getAllPlayers()
      .then((res) => {
        // remove current user
        const players = res.data.filter(
          (player: IPlayer) => player._id !== pid
        );

        players.sort((a: IPlayer, b: IPlayer) => {
          const aIsFriend = newFids.has(a._id);
          const bIsFriend = newFids.has(b._id);

          if (aIsFriend === bIsFriend) return 0;
          else if (aIsFriend && !bIsFriend) return -1;
          else return 1;
        });

        setSortedPlayers(players);
      })
      .finally(() => setLoading(false));
  }, [friendIds, pid]);

  const checkboxHandler = (isChecked: boolean, fid: string) => {
    if (isChecked) {
      setFids((prevFids) => new Set(prevFids).add(fid));
      addFriend(pid, fid);
    } else {
      setFids((prevFids) => {
        const newFids = new Set(prevFids);
        newFids.delete(fid);
        return newFids;
      });
      removeFriend(pid, fid);
    }
  };

  const Item = ({ name, _id }: { name: string; _id: string }) => (
    <Box className="flex flex-row items-center px-4 py-2 border-b border-gray-700 bg-background-dark">
      <Checkbox
        value={fids.has(_id)}
        onValueChange={(isChecked) => checkboxHandler(isChecked, _id)}
        className="mr-3"
        color={fids.has(_id) ? '#65b684' : undefined}
      />
      <ThemedText className="text-base text-text-light">{name}</ThemedText>
    </Box>
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-background-dark">
        <ActivityIndicator size="large" color="#4A90E2" />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-background-dark px-4 pt-10">
      <Box className="max-w-[380px] mx-auto">
        <ThemedText className="text-3xl font-bold mb-6 text-text-light">
          Edit Friends
        </ThemedText>
        {/* friend item in flatlist */}
        <FlatList
          data={sortedPlayers}
          renderItem={({ item }) => <Item name={item.name} _id={item._id} />}
          keyExtractor={(item) => item._id}
          className="bg-background-dark"
          showsVerticalScrollIndicator={false}
        />
      </Box>
    </ThemedView>
  );
}
