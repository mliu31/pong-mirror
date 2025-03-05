import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getPlayer } from '@/api/players';
import { Player } from '@/api/types';

export default function Profile() {
  // For now, using a hardcoded player ID.
  // Replace this with the logged-in user's ID when authentication is implemented.
  const playerId = '67b3935b7cf6fef618ed4891';

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {/* Display Player Information */}
      <Text style={styles.info}>Name: {player?.name}</Text>
      <Text style={styles.info}>Email: {player?.email}</Text>

      {/* Display Friends List */}
      <Text style={styles.subTitle}>Friends:</Text>
      <View style={styles.friendsList}>
        {player?.friends.length ? (
          player.friends.map((friend, index) => (
            <Text key={index} style={styles.friend}>
              {friend}
            </Text>
          ))
        ) : (
          <Text style={styles.info}>No friends added yet.</Text>
        )}
      </View>
    </View>
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
  }
});
