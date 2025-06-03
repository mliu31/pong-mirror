import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Join or Create Game',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="join"
        options={{
          title: 'Join Game'
        }}
      />
      <Stack.Screen
        name="scanjoin"
        options={{
          title: 'Join Game via QR Code'
        }}
      />
      <Stack.Screen
        name="[gameid]/index"
        options={{
          title: 'Add Players'
        }}
      />
      <Stack.Screen
        name="[gameid]/confirm"
        options={{
          title: 'Wait for Confirmation'
        }}
      />
      <Stack.Screen
        name="[gameid]/teamBuilder"
        options={{
          title: 'Form Teams'
        }}
      />
      <Stack.Screen
        name="[gameid]/inProgress"
        options={{
          title: 'Game Started'
        }}
      />
      <Stack.Screen
        name="[gameid]/winner"
        options={{
          title: 'Record Results'
        }}
      />
      <Stack.Screen
        name="[gameid]/summary"
        options={{
          title: 'Game Summary'
        }}
      />
    </Stack>
  );
}
