import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import LeaderboardNav from '@/components/leaderboard/leaderboard-nav';
import LeaderboardRanking from '@/components/leaderboard/leaderboard-core';
import { fetchLeaderboard } from '@/api/leaderboard';
import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';
import { ThemedView } from '@/components/ThemedView';

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

  const currentUserId = useLoggedInPlayer()._id;

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
    <ThemedView className="flex-1 p-4">
      {/* Header */}
      <Text className="text-2xl font-bold text-white p-4 pb-2 text-center">
        Leaderboard
      </Text>

      {/* Navigation Tabs */}
      <LeaderboardNav currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Conditional rendering based on loading/error states */}
      {/* Show loading spinner while fetching data */}
      {isLoading && (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Show error message if API call fails */}
      {error && (
        <View>
          <Text>{error}</Text>
        </View>
      )}

      {/* Show leaderboard only when data is loaded successfully */}
      {!isLoading && !error && <LeaderboardRanking items={items} />}
    </ThemedView>
  );
};

export default LeaderboardScreen;
