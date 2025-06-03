import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { LeaderboardItem } from '@/app/(protected)/(tabs)/leaderboard';
import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';

interface LeaderboardRankingProps {
  items: LeaderboardItem[];
}

const LeaderboardRanking: React.FC<LeaderboardRankingProps> = ({ items }) => {
  const currentPlayer = useLoggedInPlayer();

  // Render individual leaderboard row
  const renderItem = ({
    item,
    index
  }: {
    item: LeaderboardItem;
    index: number;
  }) => (
    // last item doesn't have bottom border
    // current player is highlighted
    <View
      className={`flex-row items-center p-3 ${
        index !== items.length - 1 ? 'border-b border-gray-700' : ''
      } ${item._id === currentPlayer._id ? 'bg-green-800' : ''}`}
    >
      {/* Rank column */}
      <View className="w-12">
        <Text className="text-white text-lg">{item.rank}</Text>
      </View>
      {/* Username column (takes up most space) */}
      <View className="flex-1">
        <Text className="text-white text-lg">{item.name}</Text>
      </View>
      {/* ELO score column */}
      <View>
        <Text className="text-white text-lg">{item.elo}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => `${item._id}-${item.rank}`}
      renderItem={renderItem}
    />
  );
};

export default LeaderboardRanking;
