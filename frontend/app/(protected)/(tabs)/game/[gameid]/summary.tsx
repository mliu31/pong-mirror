import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Button
} from 'react-native';
import { Game } from '@/api/types';
import { getGame } from '@/api/games';

export default function SummaryScreen() {
  const local = useLocalSearchParams();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGame(local.gameid as string)
      .then((res) => {
        setGame(res.data);

        // console.log('Fetched game data:', res.data);

        res.data.players.forEach((p) => {
          const name = p.player.name;
          const oldElo = p.oldElo ?? 1200;
          const newElo = p.newElo;

          // console.log(`${name}: ${oldElo} → ${newElo}`);
        });
      })
      .catch((err) => {
        console.error('Failed to fetch game:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [local.gameid]);

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
        data={game.players}
        keyExtractor={(item) => item.player._id}
        renderItem={({ item }) => {
          const oldElo = item.oldElo ?? 1200;
          const newElo = item.newElo ?? 'N/A';
          const change = (item.newElo ?? 0) - (item.oldElo ?? 0);

          return (
            <View style={styles.row}>
              <Text style={styles.name}>{item.player.name}</Text>
              <Text style={styles.elo}>
                {oldElo} → {newElo} ({change >= 0 ? '+' : ''}
                {change})
              </Text>
            </View>
          );
        }}
      />
      <Button title="Done" onPress={() => router.push('/profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
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
