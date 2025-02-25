import { getNonFriends } from '@/api/friends';
import { Player } from '@/api/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

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

      {nonfriends.map((nf) => {
        return <Text key={nf.name}>{nf.name} </Text>;
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
