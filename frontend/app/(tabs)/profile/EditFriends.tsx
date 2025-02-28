import { getAllPlayers } from '@/api/players';
import { Player } from '@/api/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

export default function EditFriend() {
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);
  const { friendIds } = useLocalSearchParams<{ friendIds: string }>();
  const [fids, setFids] = useState<string[]>(JSON.parse(friendIds));

  useEffect(() => {
    getAllPlayers().then((res) => {
      const players = res.data;
      players.sort((a: Player, b: Player) => {
        const aIsFriend = fids.includes(a._id);
        const bIsFriend = fids.includes(b._id);

        if (aIsFriend === bIsFriend) return 0;
        else if (aIsFriend && !bIsFriend) return -1;
        else return 1;
      });
      setSortedPlayers(players);
    });
  }, []);

  useEffect(() => {
    console.log('fids: ', fids);
    // update backend
  }, [fids]);

  const checkboxHandler = (isChecked: boolean, _id: string) => {
    console.log(isChecked, _id);
    if (isChecked) {
      setFids((prevFids) => [...prevFids, _id]);
    } else {
      setFids((prevFids) => prevFids.filter((fid) => fid !== _id));
    }
  };

  // friend item in flatlist
  const Item = ({ name, _id }: { name: string; _id: string }) => (
    <View style={styles.section}>
      <Checkbox
        style={styles.checkbox}
        value={fids.includes(_id)}
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
