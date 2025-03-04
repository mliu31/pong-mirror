import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TitleDiv from './titleDiv';
import { View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import AddButton from './addButton';
import FriendBox from './friendBox';

export default function HomeView() {
  return (
    <SafeAreaProvider>
      <View>
        <TitleDiv />
      </View>
      <AddButton category={'Friends'} />
      <FriendBox />
      <AddButton category={'Groups'} />
    </SafeAreaProvider>
  );
}
