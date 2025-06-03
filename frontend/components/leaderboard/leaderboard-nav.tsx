// components/leaderboard/LeaderboardNav.tsx
import { TouchableOpacity, View, Text } from 'react-native';
import { ThemedView } from '../ThemedView';

type Tab = 'Top' | 'League';

export default function LeaderboardNav({
  currentTab,
  onTabChange
}: {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <ThemedView className="flex-row justify-center my-4">
      {(['Top', 'League'] as Tab[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          className="mx-6 items-center"
        >
          <Text
            className={`text-lg ${
              currentTab === tab ? 'text-white font-bold' : 'text-white'
            }`}
          >
            {tab === 'Top' ? 'Top 100' : 'League'}
          </Text>
          {currentTab === tab && (
            <View className="h-0.5 bg-green-600 w-full mt-1" />
          )}
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
}
