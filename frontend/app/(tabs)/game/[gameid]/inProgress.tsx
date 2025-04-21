import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { Game } from '@/api/types';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Player } from '@/api/types';
import { ThemedView } from '@/components/ThemedView';
import TeamChips from '@/components/TeamChips';

export default function InProgress() {
  const local = useLocalSearchParams();
  const [leftTeam, setLeftTeam] = useState<Player[]>([]);
  const [rightTeam, setRightTeam] = useState<Player[]>([]);

  // sort players into left/right teams
  useEffect(() => {
    getGame(local.gameid as string).then((res) => {
      const game = res.data as Game;
      setLeftTeam(
        game.players.filter((p) => p.team === 'LEFT').map((p) => p.player)
      );
      setRightTeam(
        game.players.filter((p) => p.team === 'RIGHT').map((p) => p.player)
      );
    });
  }, [local]);

  return (
    <ThemedView className="flex-1 relative">
      <TeamChips leftTeam={leftTeam} rightTeam={rightTeam} />

      <Box className="justify-center px-4 pb-4 mt-auto">
        <ThemedText className="text-center text-typography-950 text-lg mb-2">
          May the best team win...
        </ThemedText>

        <Button
          onPress={() => router.push('./winner')}
          action="primary"
          variant="solid"
          size="md"
        >
          <ButtonText>End Game</ButtonText>
        </Button>
      </Box>
    </ThemedView>
  );
}
