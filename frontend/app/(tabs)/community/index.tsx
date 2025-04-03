import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddButton from './addButton';
import FriendBox from './friendBox';
import GroupBox from './groupBox';
import HomeView from './homeView';
import TitleDiv from './titleDiv';

// frontend layout
// span with friends
// button with add friends
// load in four friends

// span with groups
// button with add groups
// loaded groups
import { StyleSheet, Button } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { createGame } from '@/api/games';
import { useRouter } from 'expo-router';

export default function CommunityLandingScreen() {
  return (
    <SafeAreaProvider>
      <View>
        <TitleDiv />
      </View>
      <AddButton category={'Friends'} />
      <FriendBox rank={1} name={'Ethan Child'} elo={10000} />
      <FriendBox rank={1} name={'Ethan Child'} elo={10000} />
      <FriendBox rank={1} name={'Ethan Child'} elo={10000} />

      <AddButton category={'Groups'} />
      <GroupBox groupName="COSC 98!" />
      <GroupBox groupName="COSC 98!" />
      <GroupBox groupName="COSC 98!" />
      <GroupBox groupName="COSC 98!" />

    </SafeAreaProvider>
  );
}
