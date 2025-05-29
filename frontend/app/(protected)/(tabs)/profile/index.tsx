import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { getPlayer } from '@/api/players';
import { Player } from '@/api/types';
import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';
import Friends from '@/components/Friends/Friends';
import LogoutButton from '@/components/LogoutButton';

export default function Profile() {
  const playerId = useLoggedInPlayer()._id;

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) {
      setLoading(false);
      console.error('UserId is invalid');
      return;
    }

    getPlayer(playerId)
      .then((response) => {
        setPlayer(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching player data');
        setLoading(false);
      });
  }, [playerId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{player?.name}</Text>
      <Text style={styles.info}>ELO: {player?.elo}</Text>
      <Text style={styles.info}>Ranking: {player?.rank}</Text>
      <Text style={styles.info}>Games Played: {player?.gamesPlayed}</Text>
      <Text style={styles.info}>Wins: {player?.wins}</Text>

      {/* Elo History Chart */}
      {eloData.length > 1 && (
        <>
          <Text style={styles.subTitle}>Elo History</Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 16
            }}
          >
            <LineChart
              data={eloData}
              thickness={2}
              color="#4A90E2"
              hideDataPoints={false} // show default dots
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
              yAxisLabelSuffix=""
              spacing={40}
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
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  info: {
    fontSize: 18,
    marginBottom: 8
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  friendsList: {
    alignItems: 'center' // Center friends list items
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
    width: 320,
    height: 200,
    paddingHorizontal: 8
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A90E2'
  }
});
