import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { createGame } from '@/api/games';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function GameLandingScreen() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();

  return (
    <ThemedView className="flex-1 items-center">
      <View className="flex-1 justify-center gap-2 w-fit">
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
        <Button
          onPress={() => {
            router.push('/game/join');
          }}
        >
          <ButtonText>Join game</ButtonText>
        </Button>
      </View>
    </ThemedView>
  );
}
