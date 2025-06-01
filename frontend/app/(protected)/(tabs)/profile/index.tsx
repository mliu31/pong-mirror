import { getPlayer } from '@/api/players';
import { IPlayer } from '@/api/types';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { Player, Game } from '@/api/types';
import { getPlayer } from '@/api/players';
import { getGameHistory } from '@/api/games';
import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';
import Friends from '@/components/Friends/Friends';
import LogoutButton from '@/components/LogoutButton';

import PreviousGames from '@/components/PreviousGames';
import WinLossChart from '@/components/WinLossChart';

export default function Profile() {
  const playerId = useLoggedInPlayer()._id;

  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) {
      setLoading(false);
      console.error('UserId is invalid');
      return;
    }

    async function getData() {
      try {
        const [playerResp, gamesResp] = await Promise.all([
          getPlayer(playerId),
          getGameHistory(playerId)
        ]);
        setPlayer(playerResp.data);
        setGames(gamesResp.data);
      } catch (err) {
        setError('Error fetching player data or game data');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [playerId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !player) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  const eloData =
    player?.eloHistory?.map((entry) => ({
      value: entry.elo,
      label: new Date(entry.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    })) ?? [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* player info */}
      <View style={styles.playerInfoContainer}>
        <Text style={styles.title}>{player?.name}</Text>
        <Text style={styles.info}>ELO: {player?.elo}</Text>
        <Text style={styles.info}>Ranking: {player?.rank}</Text>
        <Text style={styles.info}>Games Played: {player?.gamesPlayed}</Text>
        <Text style={styles.info}>Wins: {player?.wins}</Text>
      </View>

      <Text style={styles.subTitle}>Game History</Text>

      {/* win loss pie chart */}
      <>
        <WinLossChart
          wins={player.wins}
          losses={player.gamesPlayed - player.wins}
        />
      </>

      {/* previous games */}
      {games.length > 0 && (
        <>
          <Text style={styles.subTitle2}>Previous Games</Text>
          <PreviousGames games={games} currentPlayerId={playerId} />
        </>
      )}

      {/* elo hisotry */}
      {eloData.length > 1 && (
        <>
          <Text style={styles.subTitle2}>Elo History</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={eloData}
              thickness={2}
              color="#4A90E2"
              hideDataPoints={false}
              isAnimated
              areaChart
              startFillColor="#4A90E2"
              endFillColor="#4A90E2"
              startOpacity={0.3}
              endOpacity={0}
              yAxisTextStyle={{ color: '#444' }}
              xAxisLabelTextStyle={{ color: '#444', fontSize: 10 }}
              yAxisLabelWidth={40}
              noOfSections={4}
              spacing={40}
              width={300}
              height={200}
            />
          </View>
        </>
      )}

      {player && <Friends pid={player._id} />}
      <LogoutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  playerInfoContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  subTitle2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  info: {
    fontSize: 18,
    marginBottom: 8
  },
  friendsList: {
    alignItems: 'center'
  },
  friend: {
    fontSize: 16,
    marginBottom: 4
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A90E2'
  }
});
