import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, router } from 'expo-router';
// import ClickWinner from './clickWinner';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import TeamChips from '@/components/TeamChips';
import TeamBoxes from '@/components/TeamBoxes';
import { useState } from 'react';
import { Player } from '@/api/types';
import { Dimensions, Pressable } from 'react-native';
import TEAM, { TeamValue } from '@/constants/TEAM';
import { setGameWinner } from '@/api/games';

export default function WinnerScreen() {
  const { gameid, leftTeam, rightTeam } = useLocalSearchParams<{
    gameid: string;
    leftTeam: string;
    rightTeam: string;
  }>();
  const [teamBoxHeight, setTeamBoxHeight] = useState(0); // used to center chips vertically
  const { width } = Dimensions.get('screen');
  const [winner, setWinner] = useState<TeamValue>();

  const handleConfirm = () => {
    if (winner) setGameWinner(gameid, winner);
    router.replace('/game');
  };

  // set winner depending on L/R screen pressed
  const handlePress = (event: { nativeEvent: { locationX: number } }) => {
    const x = event.nativeEvent.locationX;
    if (x < width / 2) {
      setWinner(TEAM.LEFT);
    } else {
      setWinner(TEAM.RIGHT);
    }
  };

  return (
    <ThemedView className="flex-1 relative">
      <Pressable style={{ flex: 1 }} onPressIn={handlePress}>
        <TeamBoxes setTeamBoxHeight={setTeamBoxHeight} />

        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-4 mb-auto z-10">
          <ThemedText className="text-center text-typography-950 text-xl">
            vs
          </ThemedText>
        </Box>

        {/* chips and continue button */}
        <Box className="absolute w-full h-full top-0 left-0">
          <TeamChips
            leftTeam={JSON.parse(leftTeam) as Player[]}
            rightTeam={JSON.parse(rightTeam) as Player[]}
            teamBoxHeight={teamBoxHeight}
            showLeftBorder={winner === TEAM.LEFT}
            showRightBorder={winner === TEAM.RIGHT}
          />

          <Box className="justify-center px-4 pb-4 mt-auto">
            <ThemedText className="text-center text-typography-950 text-lg mb-2">
              Tap the winning team
            </ThemedText>

            <Button
              action="primary"
              variant="solid"
              size="md"
              disabled={!winner}
              onPress={() => handleConfirm()}
              className={
                winner
                  ? 'bg-primary-500 shadow-md'
                  : 'bg-secondary-800 shadow-md'
              }
            >
              <ButtonText>Confirm</ButtonText>
            </Button>
          </Box>
        </Box>
      </Pressable>
    </ThemedView>
  );
}
