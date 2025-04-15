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

export default function Route() {
  const local = useLocalSearchParams();

  const [gameData, setGameData] = useState<Game | null>(null);
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);

  useEffect(() => {
    getGame(local.gameid as string).then((res) =>
      setGameData(res.data as Game)
    );
  }, [local.gameid]);

  const createTeamHandler = () => {
    router.push(`./inProgress`);
  };

  return (
    <ThemedView className="flex-1">
      {gameData === null ? (
        <ThemedText>Loading</ThemedText>
      ) : (
        <>
          <Box className="flex-row h-full">
            <Box className="w-1/2 bg-success-300 p-10 top-0 left-0 ">
              <Text className="text-typography-default text-left">Team 1</Text>
            </Box>

            <Box className="w-1/2 bg-secondary-50 p-10 top-0 right-0">
              <Text className="text-typography-default text-right">Team 2</Text>
            </Box>
          </Box>

          {gameData.players.map(({ player, team }) => (
            <ThemedText key={player._id}>
              {player.name}
              <TeamChoiceButtons
                pid={player._id}
                initialValue={team}
                gameid={local.gameid as string}
              />

              <PlayerChip
                pid={player._id}
                playerName={player.name}
                team={team}
              />
            </ThemedText>
          ))}
          <Button
            onPress={createTeamHandler}
            action="primary"
            disabled={continueButtonDisabled}
            variant="solid"
            size="md"
          >
            <ButtonText>Continue</ButtonText>
          </Button>
        </>
      )}
    </ThemedView>
  );
}
