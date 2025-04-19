import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';
import TeamChoiceButtons from '../../../../components/TeamChoiceButtons';
import PlayerChip from '../../../../components/PlayerChip';
import { Button, ButtonText } from '@/components/ui/button';
import { Game } from '@/api/apiTypes';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { TeamValue } from '@/constants/TEAM';

export default function Route() {
  const local = useLocalSearchParams();

  const [gameData, setGameData] = useState<Game | null>(null);
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);
  const [teamBoxHeight, setTeamBoxHeight] = useState(0); // to center chips vertically
  const [chipAssignments, setChipAssignments] = useState<
    Record<string, TeamValue>
  >({});

  useEffect(() => {
    getGame(local.gameid as string).then((res) =>
      setGameData(res.data as Game)
    );
  }, [local.gameid]);

  const createTeamHandler = () => {
    router.push(`./inProgress`);
  };

  const handleTeamChoice = (playerId: string, team: TeamValue) => {
    setChipAssignments((prev) => ({ ...prev, [playerId]: team }));
  };

  useEffect(() => {
    // count number of players on each side
    let left = 0;
    let right = 0;
    Object.values(chipAssignments).forEach((side) => {
      if (side === 'LEFT') {
        left++;
      } else if (side === 'RIGHT') {
        right++;
      }
    });

    // check all players assigned & team validity (1v1, 1v2, 2v2)
    if (gameData && gameData.players.length === left + right) {
      if (
        left > 0 &&
        right > 0 &&
        !(gameData.players.length === 4 && left !== 2 && right !== 2)
      ) {
        setContinueButtonDisabled(false);
      } else {
        setContinueButtonDisabled(true);
      }
    }
  }, [chipAssignments, gameData]);

  return (
    <ThemedView className="flex-1 relative">
      {gameData === null ? (
        <ThemedText className="text-center">Loading</ThemedText>
      ) : (
        <>
          {/* green and black team boxes */}
          <Box className="flex-row h-full">
            {/* need height prop from View onLayout to center chips vertically; Box doesn't have this handler */}
            <View
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setTeamBoxHeight(height);
              }}
              style={{
                flex: 1
              }}
            ></View>

            <Box className="w-1/2 bg-success-300 p-10 top-0 left-0 ">
              <Text className="text-typography-default text-left">Team 1</Text>
            </Box>

            <Box className="w-1/2 bg-secondary-50 p-10 top-0 right-0">
              <Text className="text-typography-default text-right">Team 2</Text>
            </Box>
          </Box>

          {/* chip overlay */}
          <Box className="absolute w-full h-full top-0 left-0">
            {teamBoxHeight > 0 &&
              gameData.players.map(({ player, team }, index) => (
                <PlayerChip
                  pid={player._id}
                  playerName={player.name}
                  teamBoxHeight={teamBoxHeight}
                  order={index}
                  totalChips={gameData.players.length}
                  onSnapSide={handleTeamChoice}
                />

                // <ThemedText key={player._id}>
                //   {player.name}
                //   </ThemedText>
                //   <TeamChoiceButtons
                //     pid={player._id}
                //     initialValue={team}
                //     gameid={local.gameid as string}
                //   />
              ))}
            <Box className="justify-center px-4 pb-4 mt-auto">
              <Button
                onPress={createTeamHandler}
                action="primary"
                disabled={continueButtonDisabled}
                variant="solid"
                size="md"
                className={
                  continueButtonDisabled === false
                    ? 'bg-primary-300 shadow-md'
                    : 'bg-secondary-800 shadow-md'
                }
              >
                <ButtonText>Continue</ButtonText>
              </Button>
            </Box>
          </Box>
        </>
      )}
    </ThemedView>
  );
}
