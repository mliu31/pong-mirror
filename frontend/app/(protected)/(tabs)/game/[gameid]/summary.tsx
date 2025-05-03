import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList
} from 'react-native';
import { Game } from '@/api/types';

export default function SummaryScreen() {
  const { gameid } = useLocalSearchParams<{
    gameid: string;
  }>();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get<Game>(
          `http://localhost:3000/games/${gameid}`,
          { withCredentials: true }
        );
        setGame(res.data);
        console.log('Elo Changes:', res.data.eloChanges);
      } catch (err) {
        console.error('Failed to fetch game:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameid]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Game not found.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game Summary</Text>
      <Text style={styles.winner}>
        {game.winner ? `${game.winner} team won` : 'No winner'}
      </Text>

      <FlatList
        data={game.players}
        keyExtractor={(item) => item.player._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.player.name}</Text>
            <Text style={styles.team}>Team: {item.team}</Text>
          </View>
        )}
      />
      <Text style={styles.header}>Elo Changes</Text>
      <FlatList
        data={game.eloChanges}
        keyExtractor={(item) => item.player._id}
        renderItem={({ item }) => {
          const change = item.newElo - item.oldElo;
          return (
            <View style={styles.row}>
              <Text style={styles.name}>{item.player.name}</Text>
              <Text style={styles.elo}>
                {item.oldElo} → {item.newElo} ({change >= 0 ? '+' : ''}
                {change})
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  winner: { fontSize: 18, fontStyle: 'italic', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  name: { fontSize: 16 },
  team: { fontSize: 16 },
  elo: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
