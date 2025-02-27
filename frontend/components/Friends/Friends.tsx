import FriendList from './FriendList';
import { router, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { getPlayer } from '@/api/players';

const Friends = ({ fids }: { fids: string[] }) => {
  const EditFriendHandler = (fids: string[]) => {
    router.push({
      pathname: '/profile/EditFriends',
      params: { friendIds: JSON.stringify(fids) }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FriendList fids={fids} />
      <Button onPress={() => EditFriendHandler(fids)} title="Edit Friends" />
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
