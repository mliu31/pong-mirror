import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TitleDiv from './titleDiv';
import { View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function HomeView() {
  return (
    <SafeAreaProvider>
      <View>
        <TitleDiv />
      </View>
      <View>
        <ThemedText>Friends</ThemedText>
      </View>
    </SafeAreaProvider>
  );
}
