// Core frontend component for leaderboard - contains ranking list of users with the user's own position highlighted

import React from 'react';
import { View, Text, FlatList } from 'react-native';

interface LeaderboardItem {
  rank: number;
  username: string;
  score: number;
}

interface LeaderboardRankingProps {
  items: LeaderboardItem[];
}

const LeaderboardRanking: React.FC<LeaderboardRankingProps> = ({ items }) => {
  // Limit to top 10 items
  const topItems = items.slice(0, 10);

  const renderItem = ({ item }: { item: LeaderboardItem }) => (
    <View>
      <Text>
        {item.rank}. {item.username} - {item.score}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={topItems}
      keyExtractor={(item) => item.rank.toString()}
      renderItem={renderItem}
    />
  );
};

export default LeaderboardRanking;
