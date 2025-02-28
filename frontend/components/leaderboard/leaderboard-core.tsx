import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface LeaderboardItem {
  rank: number;
  username: string;
  score: number;
}

interface LeaderboardRankingProps {
  items: LeaderboardItem[];
}

const LeaderboardRanking: React.FC<LeaderboardRankingProps> = ({ items }) => {
  const renderItem = ({ item }: { item: LeaderboardItem }) => (
    <View style={styles.rowContainer}>
      <View style={styles.rankContainer}>
        <Text>{item.rank}</Text>
      </View>
      <View style={styles.usernameContainer}>
        <Text>{item.username}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text>{item.score}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={(item) => item.rank.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  rankContainer: {
    flex: 1
  },
  usernameContainer: {
    flex: 3
  },
  scoreContainer: {
    flex: 1,
    alignItems: 'flex-end'
  }
});

export default LeaderboardRanking;
