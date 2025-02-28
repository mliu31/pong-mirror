import { getAllPlayers } from '@/api/players';
import { Player } from '@/api/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

export default function EditFriend() {
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);

  const { friendIds } = useLocalSearchParams<{ friendIds: string[] }>();

  useEffect(() => {
    getAllPlayers().then((res) => {
      const players = res.data;
      players.sort((a: Player, b: Player) => {
        const aIsFriend = friendIds.includes(a._id);
        const bIsFriend = friendIds.includes(b._id);

        if (aIsFriend === bIsFriend) return 0;
        else if (aIsFriend && !bIsFriend) return -1;
        else return 1;
      });
      setSortedPlayers(players);
    });
  }, [friendIds]);

  // const checkHandler = (player: Player, checked: boolean) => {
  //   console.log(player, checked);

  //   // if person in friend list,
  //   // remove from friend list db, state, & uncheck box
  //   // if person in nonfriend list, add to friend list in db, state, and check box
  // };

  // const Item = ({ _id, name, email, friends, elo }: Player) => (
  //   <View>
  //     <Text>
  //       {name} {elo}
  //     </Text>
  //     <Checkbox
  //       style={styles.checkbox}
  //       value={friends.some((friend) => friend._id === _id)}
  //       onValueChange={(checked) =>
  //         checkHandler({ _id, name, email, friends, elo }, checked)
  //       }
  //       color={
  //         friends.some((friend) => friend._id === _id) ? '#4630EB' : undefined
  //       }
  //     />
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Friends</Text>

      {sortedPlayers.map((f) => (
        <View key={f._id}>
          <Text>{f.name}</Text>
        </View>
      ))}

      {/* 
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={friends}
            renderItem={({ item }) => <Item {...item} />}
            keyExtractor={(f) => f._id}
          />
        </SafeAreaView>
      </SafeAreaProvider> */}
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
  }
});
