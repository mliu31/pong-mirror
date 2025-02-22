import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';
import TeamChoiceButtons from '../../../../components/TeamChoiceButtons';
import { Button } from 'react-native';
import { Game } from '@/api/apiTypes';

export default function Route() {
  const local = useLocalSearchParams();

  const [gameData, setGameData] = useState<Game | null>(null);

  useEffect(() => {
    getGame(local.gameid as string).then((res) =>
      setGameData(res.data as Game)
    );
  }, [local.gameid]);

  const createTeamHandler = () => {
    router.push(`./inProgress`);
  };

  return (
    <ThemedView>
      {gameData === null ? (
        <ThemedText>Loading</ThemedText>
      ) : (
        <>
          <ThemedText>Game ID: {local.gameid}</ThemedText>

          {gameData.players.map(({ player, team }) => (
            <ThemedText key={player._id}>
              Player: {player.name} - Team: {team ?? 'Unassigned'}
              <TeamChoiceButtons
                pid={player._id}
                gameid={local.gameid as string}
              />
            </ThemedText>
          ))}
          <Button title="Create Team" onPress={createTeamHandler} />
        </>
      )}
    </ThemedView>
  );
}
