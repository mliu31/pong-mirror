import { getNonFriends, getFriends } from '@/api/friends';
import { Player } from '@/api/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

export default function AddFriend() {
  const [nonfriends, setNonfriends] = useState<Player[]>([]);
  const [friends, setFriends] = useState<Player[]>([]);

  // const [checkedList, updateCheckedList] = useState<Player[]>([]);

  const { friendIds } = useLocalSearchParams<{ friendIds: string[] }>();

  useEffect(() => {
    getNonFriends(friendIds).then((res) => setNonfriends(res));
    getFriends(friendIds).then((res) => setFriends(res));
  }, [friendIds]);

  useEffect(() => {
    console.log('friends: ', friends);
    console.log('nonfriends', nonfriends);
  }, [friends, nonfriends]);

  // const checkHandler = (nf: Player, checked: boolean) => {
  // if person in friend list,
  // remove from friend list db, state, & uncheck box
  // if person in nonfriend list, add to friend list in db, state, and check box
  // };

  const Item = ({ _id, name, email, friends, elo }: Player) => (
    <View>
      <Text>
        {name} {elo}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Friends</Text>

      {friends.map((f) => (
        <View key={f._id}>
          <Text>{f.name}</Text>
        </View>
      ))}
      {nonfriends.map((nf) => (
        <View key={nf._id}>
          <Text>{nf.name}</Text>
        </View>
      ))}

      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={friends}
            renderItem={({ item }) => (
              <Item
                name={item.name}
                email={item.email}
                friends={item.friends}
                elo={item.elo}
              />
            )}
            keyExtractor={(item) => item.id}
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
  }
});
