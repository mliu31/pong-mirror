import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import { useContext, useState } from 'react';
import { createGame } from '@/api/games';
import { useRouter } from 'expo-router';
import { Badge, BadgeText } from '@/components/ui/badge';
import InviteContext from '@/context/InviteContext';

export default function GameLandingScreen() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();
  const { invites } = useContext(InviteContext);

  return (
    <ThemedView className="flex-1 items-center">
      <ThemedView className="flex-1 justify-center gap-2 w-fit">
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

        <Badge
          className={`z-10 self-end h-[22px] w-[22px] bg-red-500 rounded-full -mb-6 -mr-2 ${invites.length === 0 ? 'invisible' : ''}`}
          variant="solid"
        >
          <BadgeText className="text-white">{invites.length}</BadgeText>
        </Badge>
        <Button
          onPress={() => {
            router.push('/game/join');
          }}
        >
          <ButtonText>Join game</ButtonText>
        </Button>
      </ThemedView>
    </ThemedView>
  );
}
