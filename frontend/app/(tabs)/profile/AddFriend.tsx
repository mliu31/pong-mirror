import { getNonFriends } from '@/api/friends';
import { Player } from '@/api/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function AddFriend() {
  // get list of all users
  // filter list for non-friends
  // set nonfriends state
  // dispaly nonfriends

  const [nonfriends, setNonfriends] = useState<Player[]>([]);

  const fids = useLocalSearchParams().fids; // friends in array
  console.log('friends ADDFRIEND.TSX: ', fids);

  useEffect(() => {
    getNonFriends(fids as string[]).then((res) => setNonfriends(res));
  }, [fids]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Friends</Text>
      {/* <input type="text" placeholder="Enter friend's ID" />
      <button>Add</button> */}

      {nonfriends.map((nf) => {
        return <Text>{nf.name} </Text>;
      })}
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
  }
});
