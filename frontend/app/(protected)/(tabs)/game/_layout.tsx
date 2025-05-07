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
      cd
      <Stack.Screen
        name="[gameid]/winner"
        options={{
          title: 'Record Results'
        }}
      />
    </Stack>
  );
}
