import { getAllPlayers } from '@/api/players';
import { Player } from '@/api/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

export default function EditFriend() {
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);

  const [fids, setFids] = useState<string[]>(
    useLocalSearchParams<{ friendIds: string[] }>().friendIds
  );

  const [isChecked, setChecked] = useState(false);

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
  });

  // useEffect(() => {
  // update backend
  // }, [friendIds]);

  // const checkboxHandler = (isChecked: boolean, _id: string) => {
  //   console.log('pressed');
  //   console.log(isChecked, _id);

  //   if (isChecked) setFids([...fids, _id]);
  //   else setFids(fids.filter((pid) => pid !== _id));
  // };

  // friend item in flatlist
  const Item = ({ name, _id }: { name: string; _id: string }) => (
    <View style={styles.section}>
      <Checkbox
        style={styles.checkbox}
        // value={fids.includes(_id)}
        value={isChecked}
        // onValueChange={(isChecked) => {
        //   console.log('value changing....');
        //   checkboxHandler(isChecked, _id);
        // }}
        onValueChange={(val) => console.log(val)}
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
