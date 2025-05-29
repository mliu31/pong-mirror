// display player's previous games played on the profile page

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Game } from '@/api/types';

interface PreviousGamesProps {
  games: Game[];
  currentPlayerId: string;
}

export default function PreviousGames({
  games,
  currentPlayerId
}: PreviousGamesProps) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {games.map((game) => {
          const playerInfo = game.players.find(
            (p) => p.player._id === currentPlayerId
          );
          const team = playerInfo?.team;
          const winner = game.winner === team;
          const eloChange =
            (playerInfo?.newElo ?? 0) - (playerInfo?.oldElo ?? 0);

          return (
            // Display previous games
            <View key={game._id} style={styles.gameCard}>
              {/* TODO: date? */}
              {/* TODO: team members? */}
              <View style={styles.gameRow}>
                <Text style={styles.team}>Team: {team}</Text>
                <Text
                  style={[styles.result, { color: winner ? 'green' : 'red' }]}
                >
                  {winner ? 'Win' : 'Loss'}
                </Text>
                <Text
                  style={[
                    styles.eloChange,
                    { color: eloChange >= 0 ? 'green' : 'red' }
                  ]}
                >
                  {eloChange >= 0 ? '+' : ''}
                  {eloChange} ELO
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flex: 1
  },
  gameCard: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
    width: '90%'
  },
  gameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 6
  },
  team: {
    marginBottom: 4
  },
  result: {
    fontWeight: 'bold'
  },
  eloChange: {
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 14
  }
});
