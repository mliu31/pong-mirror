import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { IGame } from '@/api/types';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { IPlayer } from '@/api/types';
import { ThemedView } from '@/components/ThemedView';
import TeamChips from '@/components/TeamChips';
import TeamBoxes from '@/components/TeamBoxes';
import TEAM from '@/constants/TEAM';

export default function InProgress() {
  const local = useLocalSearchParams();
  const [leftTeam, setLeftTeam] = useState<IPlayer[]>([]);
  const [rightTeam, setRightTeam] = useState<IPlayer[]>([]);
  const [teamBoxHeight, setTeamBoxHeight] = useState(0); // used to center chips vertically

  // group players into left/right teams
  useEffect(() => {
    getGame(local.gameid as string).then((res) => {
      const game = res.data as IGame;
      setLeftTeam(
        game.players.filter((p) => p.team === TEAM.LEFT).map((p) => p.player)
      );
      setRightTeam(
        game.players.filter((p) => p.team === TEAM.RIGHT).map((p) => p.player)
      );
    });
  }, [local.gameid]);

  return (
    <ThemedView className="flex-1 relative">
      <TeamBoxes setTeamBoxHeight={setTeamBoxHeight} />

      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-4 mb-auto z-10">
        <ThemedText className="text-center text-typography-950 text-xl">
          vs
        </ThemedText>
      </Box>

      {/* chips and continue button */}
      <Box className="absolute w-full h-full top-0 left-0">
        <TeamChips
          leftTeam={leftTeam}
          rightTeam={rightTeam}
          teamBoxHeight={teamBoxHeight}
        />

        <Box className="justify-center px-4 pb-4 mt-auto">
          <ThemedText className="text-center text-typography-950 text-lg mb-2">
            May the best team win...
          </ThemedText>

          <Button
            action="primary"
            variant="solid"
            size="md"
            onPress={() =>
              router.push({
                pathname: './winner',
                params: {
                  leftTeam: JSON.stringify(leftTeam),
                  rightTeam: JSON.stringify(rightTeam),
                  teamBoxHeight: teamBoxHeight
                }
              })
            }
          >
            <ButtonText>End Game</ButtonText>
          </Button>
        </Box>
      </Box>
    </ThemedView>
  );
}
