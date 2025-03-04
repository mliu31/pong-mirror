import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Define an interface for the player data coming from the server.
export interface IPlayerUI {
  _id: string;
  userID: number;
  name: string;
  email: string;
  friends: string[];
  elo: number;
  rank: number;
}

interface ProfileProps {
  // The id is expected to be the Mongoose _id from your Player model.
  playerId: string;
}

const Profile: React.FC<ProfileProps> = ({ playerId }) => {
  const [profile, setProfile] = useState<IPlayerUI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Adjust the host/port if necessary. If using a proxy, you can use a relative URL.
        const response = await fetch(`http://localhost:${process.env.PORT || 3000}/profile/${playerId}`);
        if (!response.ok) {
          throw new Error('Error fetching profile data');
        }
        const data: IPlayerUI = await response.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [playerId]);

  if (loading) return <ActivityIndicator style={styles.centered} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!profile) return <Text style={styles.error}>No profile data available.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile.name}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>ELO Score: {profile.elo}</Text>
      <Text>Rank: {profile.rank}</Text>
      <Text>Friends count: {profile.friends.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default Profile;