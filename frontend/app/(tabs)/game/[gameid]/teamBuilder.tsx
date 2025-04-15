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

export default function Route() {
  const local = useLocalSearchParams();

  const [gameData, setGameData] = useState<Game | null>(null);
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);
  const [teamBoxHeight, setTeamBoxHeight] = useState(0); // to center chips vertically

  useEffect(() => {
    getGame(local.gameid as string).then((res) =>
      setGameData(res.data as Game)
    );
  }, [local.gameid]);

  const createTeamHandler = () => {
    router.push(`./inProgress`);
  };

  return (
    <ThemedView className="flex-1 relative">
      {gameData === null ? (
        <ThemedText className="text-center">Loading</ThemedText>
      ) : (
        <>
          <Box className="flex-row h-full">
            {/* need height from View onLayout to center chips vertically; Box doesn't have this handler */}
            <View
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setTeamBoxHeight(height);
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            ></View>
            <Box className="w-1/2 bg-success-300 p-10 top-0 left-0 ">
              <Text className="text-typography-default text-left">Team 1</Text>
            </Box>

            <Box className="w-1/2 bg-secondary-50 p-10 top-0 right-0">
              <Text className="text-typography-default text-right">Team 2</Text>
            </Box>
          </Box>
          <Box className="absolute w-full h-full top-0 left-0">
            {teamBoxHeight > 0 &&
              gameData.players.map(({ player, team }) => (
                <ThemedText key={player._id}>
                  <PlayerChip
                    pid={player._id}
                    playerName={player.name}
                    team={team}
                    teamBoxHeight={teamBoxHeight}
                  />
                  {player.name}
                  <TeamChoiceButtons
                    pid={player._id}
                    initialValue={team}
                    gameid={local.gameid as string}
                  />
                </ThemedText>
              ))}
          </Box>

          <Box className="justify-center p-4">
            <Button
              onPress={createTeamHandler}
              action="primary"
              disabled={continueButtonDisabled}
              variant="solid"
              size="md"
            >
              <ButtonText>Continue</ButtonText>
            </Button>
          </Box>
        </>
      )}
    </ThemedView>
  );
}
