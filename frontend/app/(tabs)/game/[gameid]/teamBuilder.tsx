import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';

export default function Route() {
  const local = useLocalSearchParams();

  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    getGame(local.gameid as string).then((res) => setGameData(res.data));
  }, []);

  return (
    <ThemedView>
      <ThemedText>
        This page will display information for the game with ID: {local.gameid}
      </ThemedText>
      {gameData === null ? (
        <ThemedText>Loading</ThemedText>
      ) : (
        <ThemedText>{gameData}</ThemedText>
      )}
      <ThemedText></ThemedText>
    </ThemedView>
  );
}
