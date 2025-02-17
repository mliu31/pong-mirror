// nav bar specific for leaderboard that contains global and league tabs

import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

type Tab = 'Top' | 'League';

interface LeaderboardNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const LeaderboardNav: React.FC<LeaderboardNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onTabChange('Top')}>
        <Text>{currentTab === 'Top' ? 'Top (active)' : 'Top'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabChange('League')}>
        <Text>{currentTab === 'League' ? 'League (active)' : 'League'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LeaderboardNav;
