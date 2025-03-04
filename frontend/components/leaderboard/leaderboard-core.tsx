import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { LeaderboardItem } from '@/app/(tabs)/leaderboard';

interface LeaderboardRankingProps {
  items: LeaderboardItem[];
}

const LeaderboardRanking: React.FC<LeaderboardRankingProps> = ({ items }) => {
  // Render individual leaderboard row
  const renderItem = ({ item }: { item: LeaderboardItem }) => (
    <View style={styles.rowContainer}>
      {/* Rank column */}
      <View style={styles.rankContainer}>
        <Text>{item.rank}</Text>
      </View>
      {/* Username column (takes up most space) */}
      <View style={styles.usernameContainer}>
        <Text>{item.name}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text>{item.elo}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={(item) => `${item.userID}-${item.rank}`}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  // Row styling for 3-column layout
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  // Column styles with flex distribution
  rankContainer: {
    flex: 1 // Takes up 1/5 of the space
  },
  usernameContainer: {
    flex: 3 // Takes up 3/5 of the space
  },
  scoreContainer: {
    flex: 1, // Takes up 1/5 of the space
    alignItems: 'flex-end' // Right align the score
  }
});

export default LeaderboardRanking;
