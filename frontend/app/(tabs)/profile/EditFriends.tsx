import { getAllPlayers } from '@/api/players';
import { Player } from '@/api/types';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import { addFriend, removeFriend } from '@/api/friends';

export default function EditFriend() {
  // read in params
  const { friendIds, pid } = useLocalSearchParams<{
    friendIds: string;
    pid: string;
  }>();

  // state for friend ids and sorted list of friends/nonfriends

  // state for friend ids and sorted list of friends/nonfriends
  const [fids, setFids] = useState<Set<string>>(new Set());
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);

  // on page load
  useEffect(() => {
    const newFids = new Set(JSON.parse(friendIds) as string[]);

    // update state as set of friend ids
    setFids(new Set(newFids));

    getAllPlayers().then((res) => {
      const players = res.data;
      //  sorts all players into friends and nonfriends
      players.sort((a: Player, b: Player) => {
        const aIsFriend = newFids.has(a._id);
        const bIsFriend = newFids.has(b._id);

        if (aIsFriend === bIsFriend) return 0;
        else if (aIsFriend && !bIsFriend) return -1;
        else return 1;
      });
      setSortedPlayers(players);
    });
  }, [friendIds, pid]);

  const checkboxHandler = (isChecked: boolean, fid: string) => {
    if (isChecked) {
      setFids((prevFids) => new Set(prevFids.add(fid)));
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

  // friend item in flatlist
  const Item = ({ name, _id }: { name: string; _id: string }) => (
    <View style={styles.section}>
      <Checkbox
        style={styles.checkbox}
        value={fids.has(_id)}
        onValueChange={(isChecked) => checkboxHandler(isChecked, _id)}
      />
      <Text style={styles.paragraph}>{name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Friends</Text>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={sortedPlayers}
            renderItem={({ item }) => <Item name={item.name} _id={item._id} />}
            keyExtractor={(item) => item._id}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  checkbox: {
    margin: 8
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paragraph: {
    fontSize: 15
  }
});
