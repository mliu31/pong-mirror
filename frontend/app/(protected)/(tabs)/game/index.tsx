import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { createGame } from '@/api/games';
import { useRouter } from 'expo-router';

export default function GameLandingScreen() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();

  return (
    <ThemedView className="flex-1 items-center justify-center">
      <Button
        className="w-fit"
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
      <Button
        className="w-fit"
        onPress={() => {
          router.push('/game/join');
        }}
      >
        <ButtonText>Join game</ButtonText>
      </Button>
    </ThemedView>
  );
}
