import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Tab = 'Top' | 'League';

interface LeaderboardNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const LeaderboardNav: React.FC<LeaderboardNavProps> = ({
  currentTab,
  onTabChange
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tabButton, currentTab === 'Top' && styles.activeTab]}
        onPress={() => onTabChange('Top')}
      >
        <Text>Top</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, currentTab === 'League' && styles.activeTab]}
        onPress={() => onTabChange('League')}
      >
        <Text>League</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    backgroundColor: '#ddd',
    borderRadius: 4
  },
  activeTab: {
    backgroundColor: '#007AFF'
  }
});

export default LeaderboardNav;
