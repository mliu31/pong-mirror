import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import LeaderboardNav from './leaderboard-nav';
import LeaderboardRanking from './leaderboard-core';

type Tab = 'Top' | 'League';

export interface LeaderboardItem {
  rank: number;
  username: string;
  score: number;
}

// Hardcoded dummy data for the "Top"
const topLeaderboardItems: LeaderboardItem[] = [
  { rank: 1, username: 'User1', score: 100 },
  { rank: 2, username: 'User2', score: 95 },
  { rank: 3, username: 'User3', score: 90 },
  { rank: 4, username: 'User4', score: 85 },
  { rank: 5, username: 'User5', score: 80 },
  { rank: 6, username: 'User6', score: 75 },
  { rank: 7, username: 'User7', score: 70 },
  { rank: 8, username: 'User8', score: 65 },
  { rank: 9, username: 'User9', score: 60 },
  { rank: 10, username: 'User10', score: 55 }
];

// Hardcoded dummy data for the "League"
const leagueLeaderboardItems: LeaderboardItem[] = [
  { rank: 20, username: 'User20', score: 40 },
  { rank: 21, username: 'User21', score: 38 },
  { rank: 22, username: 'User22', score: 36 },
  { rank: 23, username: 'You', score: 34 }, // Assume current user
  { rank: 24, username: 'User24', score: 32 },
  { rank: 25, username: 'User25', score: 30 }
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
