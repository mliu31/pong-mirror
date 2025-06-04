import { useState, useCallback } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { getPlayer } from '@/api/players';
import { getGameHistory } from '@/api/games';
import { IPlayer, IGame } from '@/api/types';
import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import Friends from '@/components/Friends/Friends';
import LogoutButton from '@/components/LogoutButton';
import PreviousGames from '@/components/PreviousGames';
import WinLossChart from '@/components/WinLossChart';
import { LineChart } from 'react-native-gifted-charts';
import { useFocusEffect } from 'expo-router';

export default function Profile() {
  const playerId = useLoggedInPlayer()._id;

  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!playerId) {
        setLoading(false);
        setError('User ID is invalid');
        return;
      }

      async function fetchData() {
        try {
          const [playerRes, gamesRes] = await Promise.all([
            getPlayer(playerId),
            getGameHistory(playerId)
          ]);
          setPlayer(playerRes.data);
          setGames(gamesRes.data);
        } catch (err) {
          setError('Error fetching player or game data.');
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }, [playerId])
  );

  const eloData =
    player?.eloHistory?.map((entry) => ({
      value: entry.elo,
      label: new Date(entry.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    })) ?? [];

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4A90E2" />
      </ThemedView>
    );
  }

  if (error || !player) {
    return (
      <ThemedView className="flex-1 justify-center items-center px-6">
        <ThemedText className="text-lg text-red-600 text-center">
          {error ?? 'Player not found.'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <ThemedView className="px-4 pt-10 items-center">
        <Box className="w-full max-w-[800px]">
          {/* Player Info */}
          <Box className="items-center mb-4">
            <ThemedText className="text-3xl font-bold">
              {player.name}
            </ThemedText>
            <Box className="mt-4 flex-row justify-center">
              <Box className="items-center mr-2">
                {/* TODO: a better way to implement text color? */}
                <ThemedText style={{ color: '#65b684' }} className="text-lg">
                  Elo:
                </ThemedText>
                <ThemedText style={{ color: '#65b684' }} className="text-lg">
                  Rank:
                </ThemedText>
              </Box>

              <Box className="items-center">
                <ThemedText className="text-lg">{player.elo}</ThemedText>
                <ThemedText className="text-lg">#{player.rank}</ThemedText>
              </Box>
            </Box>
          </Box>

          <ThemedText className="text-xl font-bold font-center text-left">
            Friends
          </ThemedText>
          <Friends pid={player._id} />

          {/* Win/Loss Chart */}
          <Box className="mt-8">
            <ThemedText className="text-xl font-bold font-center text-left mb-2">
              Game History
            </ThemedText>
            <WinLossChart
              wins={player.wins}
              losses={player.gamesPlayed - player.wins}
            />
          </Box>

          {/* Previous Games */}
          {games.length > 0 && (
            <Box className="mt-8">
              <ThemedText
                className="text-xl font-semibold text-left"
                style={{ color: '#65b684' }}
              >
                Previous Games
              </ThemedText>
              <PreviousGames games={games} currentPlayerId={playerId} />
            </Box>
          )}

          {/* Elo History Chart */}
          {eloData.length > 1 && (
            <Box className="mt-10">
              <ThemedText
                className="text-xl font-semibold text-left mb-1"
                style={{ color: '#65b684' }}
              >
                Elo History
              </ThemedText>
              <Box style={{ alignSelf: 'center' }}>
                <LineChart
                  data={eloData}
                  thickness={2}
                  color="#65b684"
                  hideDataPoints={true}
                  isAnimated
                  areaChart
                  startFillColor="#65b684"
                  endFillColor="#161719"
                  startOpacity={0.3}
                  endOpacity={0}
                  yAxisTextStyle={{ color: '#444' }}
                  xAxisLabelTextStyle={{ color: '#444', fontSize: 10 }}
                  yAxisLabelWidth={40}
                  noOfSections={4}
                  spacing={40}
                  width={400}
                  height={300}
                />
              </Box>
            </Box>
          )}

          {/* Logout */}
          <Box className="mt-10">
            <LogoutButton />
          </Box>
        </Box>
      </ThemedView>
    </ScrollView>
  );
}
