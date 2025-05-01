import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';
import LeaderboardNav from '@/components/leaderboard/leaderboard-nav';
import LeaderboardRanking from '@/components/leaderboard/leaderboard-core';
import { fetchLeaderboard } from '@/api/leaderboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type Tab = 'Top' | 'League';

export interface LeaderboardItem {
  _id: string;
  name: string;
  elo: number;
  rank: number;
}

const LeaderboardScreen: React.FC = () => {
  // State management for tab selection
  const [currentTab, setCurrentTab] = useState<Tab>('Top');
  // State to store leaderboard data from API
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(true);
  // Error state for API failures
  const [error, setError] = useState<string | null>(null);

  const currentUserId = useSelector(
    (state: RootState) => state.auth.basicPlayerInfo?._id
  );

  // Effect hook to fetch leaderboard data whenever tab changes
  useEffect(() => {
    if (!currentUserId) {
      setItems([]);
      setError(null);
      setIsLoading(false);
      console.error('UserId is invalid');
      return;
    }

    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchLeaderboard(currentTab, currentUserId);
        // No transformation needed, use the data directly
        setItems(response.players);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error('Error loading leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [currentTab, currentUserId]);

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Leaderboard</Text>

      {/* Navigation Tabs */}
      <LeaderboardNav currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Conditional rendering based on loading/error states */}
      {/* Show loading spinner while fetching data */}
      {isLoading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Show error message if API call fails */}
      {error && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Show leaderboard only when data is loaded successfully */}
      {!isLoading && !error && <LeaderboardRanking items={items} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  // New styles for loading and error states
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});

export default LeaderboardScreen;
