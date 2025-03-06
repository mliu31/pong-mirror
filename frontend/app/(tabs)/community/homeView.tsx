import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TitleDiv from './titleDiv';
import { View } from 'react-native';
import AddButton from './addButton';
import FriendBox from './friendBox';
import GroupBox from './groupBox';

export default function HomeView() {
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
    </SafeAreaProvider>
  );
}
