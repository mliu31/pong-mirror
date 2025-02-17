import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';

export default function Route() {
  const local = useLocalSearchParams();

  type GameData = {
    _id: string;
    players: {
      player: {
        _id: string;
        name: string;
        email: string;
      }; // ObjectId as string
      team: 'RED' | 'BLUE' | null;
    }[];
  };

  // const [gameData, setGameData] = useState(null);
  const [gameData, setGameData] = useState<GameData | null>(null);

  useEffect(() => {
    getGame(local.gameid as string).then((res) =>
      setGameData(res.data as GameData)
    );
  }, []);

  return (
    <ThemedView>
      <ThemedText>
        This page will display information for the game with ID: {local.gameid}
      </ThemedText>
      {gameData === null ? (
        <ThemedText>Loading</ThemedText>
      ) : (
        <>
          <ThemedText>Game Data:</ThemedText>
          <ThemedText>{JSON.stringify(gameData)}</ThemedText>
          {console.log(gameData)}
          {gameData.players.map(({ player, team }) => (
            <ThemedText key={player._id}>
              Player ID: {player.name} - Team: {team ?? 'Unassigned'}
            </ThemedText>
          ))}
        </>
      )}
    </ThemedView>
  );
}
