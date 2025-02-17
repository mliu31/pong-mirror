import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function Route() {
  const local = useLocalSearchParams();

  return (
    <ThemedView>
      <ThemedText>
        This page will display information for the game with ID: {local.game}
      </ThemedText>
    </ThemedView>
  );
}
