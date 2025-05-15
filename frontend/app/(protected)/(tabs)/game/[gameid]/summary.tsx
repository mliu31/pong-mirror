import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Dimensions, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { getGame } from '@/api/games';
import { Game } from '@/api/types';
import PlayerCircle from '@/components/PlayerCircle';

export default function SummaryScreen() {
  const local = useLocalSearchParams();

  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    getGame(local.gameid as string)
      .then((res) => {
        setGame(res.data);
        // // console.log('Fetched game data:', res.data);
        // res.data.players.forEach((p) => {
        //   const name = p.player.name;
        //   const oldElo = p.oldElo ?? 1200;
        //   const newElo = p.newElo;
        //   // console.log(`${name}: ${oldElo} → ${newElo}`);
        // });
      })
      .catch((err) => {
        console.error('Failed to fetch game:', err);
      });
  }, [local.gameid]);

  if (!game) {
    return (
      <ThemedView className="p-5">
        <ThemedText>Game not found.</ThemedText>
      </ThemedView>
    );
  }

  const screenHeight = Dimensions.get('window').height;
  const numPlayers = game.players.length;
  const circleSize = Math.min((screenHeight - 300) / numPlayers, 100);

  return (
    <ThemedView className="flex-1 px-6 pt-10 pb-6">
      {/* Announce the winning team */}
      <Box className="items-center mt-10">
        <ThemedText className="text-xl font-semibold text-success-700 text-center">
          🎉 The {game.winner} team won!
        </ThemedText>
      </Box>

      {/* List players and their elo changes */}
      <FlatList
        data={game.players}
        keyExtractor={(item) => item.player._id}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingBottom: 20
        }}
        renderItem={({ item }) => {
          const oldElo = item.oldElo ?? 1200;
          const newElo = item.newElo ?? 'N/A';
          const change = (item.newElo ?? 0) - (item.oldElo ?? 0);

          return (
            <Box
              className="py-2"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: circleSize + 20
              }}
              key={item.player._id}
            >
              <Box className="flex-row items-center space-x-6 justify-center">
                <PlayerCircle
                  name={item.player.name}
                  size={circleSize}
                  bgLightColor={
                    item.team === game.winner ? '#65b684' : '#e5e7eb'
                  }
                  bgDarkColor={
                    item.team === game.winner ? '#65b684' : '#374151'
                  }
                  textLightColor={
                    item.team === game.winner ? '#ffffff' : '#374151'
                  }
                  textDarkColor={
                    item.team === game.winner ? '#ffffff' : '#e5e7eb'
                  }
                />
                <ThemedText className="text-base font-bold text-typography-900">
                  {oldElo} → {newElo} ({change >= 0 ? '+' : ''}
                  {change})
                </ThemedText>
              </Box>
            </Box>
          );
        }}
      />

      <Box className="mt-8">
        <Button
          action="primary"
          variant="solid"
          size="md"
          onPress={() => router.push('/profile')}
        >
          <ButtonText>Done</ButtonText>
        </Button>
      </Box>
    </ThemedView>
  );
}
