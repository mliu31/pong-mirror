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
  const [checkedList, updateCheckedList] = useState<Player[]>([]);

  const fids = useLocalSearchParams().fids; // friends in array

  useEffect(() => {
    getNonFriends(fids as string[]).then((res) => setNonfriends(res));
  }, [fids]);
    const checkHandler = (nf: Player, checked: boolean) => {
    if (checked && !checkedList.some((e) => e.email === nf.email)) {
      updateCheckedList([...checkedList, nf]);
    } else if (!checked && checkedList.some((e) => e.email === nf.email)) {
      updateCheckedList(checkedList.filter((e) => e.email !== nf.email));
    }
  };

  useEffect(() => {
    console.log(checkedList);
  }, [checkedList]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Friends</Text>

    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={nonfriends}
            keyExtractor={(nf) => nf.email}
            renderItem={({ item: nf }) => (
              <View>
                <Text>{nf.name}</Text>
                <Checkbox
                  style={styles.checkbox}
                  value={
                    checkedList.some((e) => e.email === nf.email) ? true : false
                  }
                  onValueChange={(e) => checkHandler(nf, e)}
                />
              </View>
            )}
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
  },
  checkbox: {
    margin: 8
  }
});
