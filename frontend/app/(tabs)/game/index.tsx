import { StyleSheet, Button } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { createGame } from '@/api/games';
import { useRouter } from 'expo-router';

export default function TabTwoScreen() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Button
        title="Start Game"
        disabled={buttonDisabled}
        onPress={async (ev) => {
          setButtonDisabled(true);
          const gameResponse = await createGame();
          router.push(`/game/${gameResponse.data.id}`);
          setButtonDisabled(false);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: '1rem'
  }
});
