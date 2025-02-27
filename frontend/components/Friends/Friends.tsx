import FriendList from './FriendList';
import { router } from 'expo-router';
import { Button, StyleSheet, View, Text } from 'react-native';

const Friends = ({ fids }: { fids: string[] }) => {
  const addFriendHandler = (fids: string[]) => {
    router.push({
      pathname: '/profile/AddFriend',
      params: { fids: JSON.stringify(fids) }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FriendList fids={fids} />
      <Button onPress={() => addFriendHandler(fids)} title="Add Friend" />
    </View>
  );
};

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

export default Friends;
