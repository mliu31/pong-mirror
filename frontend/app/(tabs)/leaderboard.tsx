// added leaderboard wrapper component
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import LeaderboardNav from './LeaderboardNav';
import LeaderboardRanking from '../components/LeaderboardRanking';

type Tab = 'Top' | 'League';

export interface LeaderboardItem {
  rank: number;
  username: string;
  score: number;
}

// Dummy data for the "Top" tab
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

// Dummy data for the "League" tab
const leagueLeaderboardItems: LeaderboardItem[] = [
  { rank: 1, username: 'LeagueUser1', score: 50 },
  { rank: 2, username: 'LeagueUser2', score: 45 },
  { rank: 3, username: 'LeagueUser3', score: 40 },
  { rank: 4, username: 'LeagueUser4', score: 35 },
  { rank: 5, username: 'LeagueUser5', score: 30 },
  { rank: 6, username: 'LeagueUser6', score: 25 },
  { rank: 7, username: 'LeagueUser7', score: 20 },
  { rank: 8, username: 'LeagueUser8', score: 15 },
  { rank: 9, username: 'LeagueUser9', score: 10 },
  { rank: 10, username: 'LeagueUser10', score: 5 }
];

const LeaderboardScreen: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('Top');

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
  };

  // Choose the data based on the current tab
  const itemsToDisplay =
    currentTab === 'Top' ? topLeaderboardItems : leagueLeaderboardItems;

  return (
    <View>
      {/* Header */}
      <Text>Leaderboard</Text>

      {/* Navigation Tabs */}
      <LeaderboardNav currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Leaderboard Ranking List */}
      <LeaderboardRanking items={itemsToDisplay} />
    </View>
  );
};

export default LeaderboardScreen;
