import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import InviteContext from '@/context/InviteContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { invites } = useContext(InviteContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          height: 60,
          paddingTop: 8
        }
      }}
    >
      <Tabs.Screen
        name="game"
        options={{
          title: 'Game',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus" color={color} />
          ),
          tabBarBadge: invites.length > 0 ? '' : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ef4444',
            minWidth: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 4,
            marginTop: 4
          }
        }}
      />
      <Tabs.Screen
        name="tournament"
        options={{
          title: 'Tournament',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="tournament" size={28} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => (
            // <IconSymbol size={28} name="chart.bar.fill" color={color} />
            <MaterialCommunityIcons name="trophy" size={28} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.circle.fill" color={color} />
          )
        }}
      />
    </Tabs>
  );
}
