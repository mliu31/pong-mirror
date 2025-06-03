import { Stack } from 'expo-router';

export default function TournamentLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Tournament',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="teams"
        options={{
          title: 'Tournament Teams',
          headerShown: true
        }}
      />
    </Stack>
  );
}
