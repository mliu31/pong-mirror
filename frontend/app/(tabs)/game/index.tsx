import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { createGame } from '@/api/games';
import { useRouter } from 'expo-router';

export default function GameLandingScreen() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();

  return (
    <ThemedView>
      <VStack style={{ flex: 1 }} space="md">
        <Button
          isDisabled={buttonDisabled}
          onPress={async () => {
            setButtonDisabled(true);
            const gameResponse = await createGame();
            router.push(`/game/${gameResponse.data.id}`);
            setButtonDisabled(false);
          }}
        >
          <ButtonText>Create game</ButtonText>
        </Button>
      </VStack>
    </ThemedView>
  );
}
