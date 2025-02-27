import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import LeaderboardNav from '@/components/leaderboard/leaderboard-nav';
import LeaderboardRanking from '@/components/leaderboard/leaderboard-core';

type Tab = 'Top' | 'League';

export interface LeaderboardItem {
  userID: number;
  rank: number;
  username: string;
  score: number;
}

// Hardcoded dummy data for the "Top"
const topLeaderboardItems: LeaderboardItem[] = [
  { userID: 1, rank: 1, username: 'User1', score: 100 },
  { userID: 1, rank: 2, username: 'User2', score: 95 },
  { userID: 1, rank: 3, username: 'User3', score: 90 },
  { userID: 1, rank: 4, username: 'User4', score: 85 },
  { userID: 1, rank: 5, username: 'User5', score: 80 },
  { userID: 1, rank: 6, username: 'User6', score: 75 },
  { userID: 1, rank: 7, username: 'User7', score: 70 },
  { userID: 1, rank: 8, username: 'User8', score: 65 },
  { userID: 1, rank: 9, username: 'User9', score: 60 },
  { userID: 1, rank: 10, username: 'User10', score: 55 }
];

// Hardcoded dummy data for the "League"
const leagueLeaderboardItems: LeaderboardItem[] = [
  { userID: 1, rank: 20, username: 'User20', score: 40 },
  { userID: 1, rank: 21, username: 'User21', score: 38 },
  { userID: 1, rank: 22, username: 'User22', score: 36 },
  { userID: 1, rank: 23, username: 'You', score: 34 }, // Assume current user
  { userID: 1, rank: 24, username: 'User24', score: 32 },
  { userID: 1, rank: 25, username: 'User25', score: 30 }
];

const LeaderboardScreen: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('Top');

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
  };

  const itemsToDisplay =
    currentTab === 'Top' ? topLeaderboardItems : leagueLeaderboardItems;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Leaderboard</Text>

      {/* Navigation Tabs */}
      <LeaderboardNav currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Leaderboard Ranking List */}
      <LeaderboardRanking items={itemsToDisplay} />
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
  }
});

export default LeaderboardScreen;
