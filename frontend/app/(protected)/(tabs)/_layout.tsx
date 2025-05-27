import { Tabs, useRootNavigationState, useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppSelector } from '@/redux/redux-hooks';
import { Badge, BadgeText } from '@/components/ui/badge';
import InviteContext from '@/context/InviteContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { invites } = useContext(InviteContext);

  // TODO: flesh out route protection
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return; // waiting for router
    if (!basicPlayerInfo) {
      router.replace('/signup');
    }
  }, [basicPlayerInfo, rootNavigationState, router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     position: 'absolute'
        //   },
        //   default: {}
        // })
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          )
        }}
      />
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
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
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
