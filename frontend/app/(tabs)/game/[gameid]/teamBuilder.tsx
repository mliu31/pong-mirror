import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';
import { Game } from '@/api/types';
import { View, Text, Dimensions } from 'react-native';
import { TeamValue } from '@/constants/TEAM';
import { updatePlayerTeam } from '@/api/games';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import PlayerChip from '@/components/PlayerChip';
import { CHIP_DIAM, CHIP_HEIGHT } from '@/constants/CHIP';

export default function TeamBuilder() {
  const local = useLocalSearchParams();
  const [gameData, setGameData] = useState<Game | null>(null);
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);
  const [chipAssignments, setChipAssignments] = useState<
    Record<string, TeamValue>
  >({});
  const [teamBoxHeight, setTeamBoxHeight] = useState(0); // used to center chips vertically

  // get game data from BE & set initial chip assignments
  useEffect(() => {
    getGame(local.gameid as string).then((res) => {
      setGameData(res.data as Game);
      res.data.players.forEach((player) => {
        setChipAssignments((prev) => ({
          ...prev,
          [player.player._id]: player.team
        }));
      });
    });
  }, [local.gameid]);

  // handle chip drag & drop
  const handleTeamChoice = (playerId: string, team: TeamValue) => {
    setChipAssignments((prev) => ({
      ...prev,
      [playerId]: team
    }));
  };

  useEffect(() => {
    // count number of players on each side
    let left = 0;
    let right = 0;
    Object.values(chipAssignments).forEach((team) => {
      if (team === 'LEFT') {
        left++;
      } else if (team === 'RIGHT') {
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

  const createTeamHandler = async () => {
    // set teams in BE from chipAssignments
    const updatePromises = Object.entries(chipAssignments).map(
      ([pid, team]) => {
        updatePlayerTeam(pid, team, local.gameid as string);
      }
    );
    await Promise.all(updatePromises);

    router.push({
      pathname: `./inProgress`
    });
  };

  // dimension constants
  const { width } = Dimensions.get('screen');

  // left and right team positions
  const leftX = width * 0.25 - CHIP_DIAM / 2;
  const rightX = width * 0.75 - CHIP_DIAM / 2;

  return (
    <ThemedView className="flex-1 relative">
      {gameData === null ? (
        <ThemedText className="text-center">Loading</ThemedText>
      ) : (
        <>
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

            {/* L/R team boxes */}
            <Box className="w-1/2 bg-success-300 p-10 top-0 left-0 ">
              <Text className="text-typography-950 text-left">Team 1</Text>
            </Box>

            <Box className="w-1/2 bg-secondary-50 p-10 top-0 right-0">
              <Text className="text-typography-950 text-right">Team 2</Text>
            </Box>
          </Box>

          {/* chip overlay */}
          <Box className="absolute w-full h-full top-0 left-0">
            {teamBoxHeight > 0 &&
              gameData.players.map(({ player, team }, index) => (
                <PlayerChip
                  key={player._id}
                  pid={player._id}
                  playerName={player.name}
                  position={{
                    x:
                      team === 'LEFT'
                        ? leftX
                        : team === 'RIGHT'
                          ? rightX
                          : width / 2 - CHIP_DIAM / 2,
                    y:
                      teamBoxHeight / 2 -
                      (CHIP_HEIGHT * gameData.players.length) / 2 +
                      CHIP_HEIGHT * index
                  }}
                  dragging={true}
                  bounds={{
                    minX: 0,
                    maxX: width,
                    minY: 0,
                    maxY: teamBoxHeight
                  }}
                  onSnapSide={handleTeamChoice}
                />
              ))}
            <Box className="justify-center px-4 pb-4 mt-auto">
              <ThemedText className="text-center text-typography-950 text-lg mb-2">
                Drag players to assign teams
              </ThemedText>

              <Button
                onPress={createTeamHandler}
                action="primary"
                disabled={continueButtonDisabled}
                variant="solid"
                size="md"
                className={
                  continueButtonDisabled === false
                    ? 'bg-primary-500 shadow-md'
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
