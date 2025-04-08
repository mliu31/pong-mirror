import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import api from '@/api';
import { Player } from '@/api/types';
import { FlatList } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import { getAllPlayers } from '@/api/players';
import { getGame } from '@/api/games';
import { Button, ButtonText } from '@/components/ui/button';

export default function Route() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const [allPlayers, setAllPlayers] = useState<Player[] | null>(null);
  const [playerUpdates, setPlayerUpdates] = useState<
    Record<Player['_id'], boolean>
  >({});

  useEffect(
    () => void getAllPlayers().then(({ data }) => setAllPlayers(data)),
    []
  );

  useEffect(
    () =>
      void getGame(gameid).then(({ data }) =>
        setPlayerUpdates((prev) => ({
          ...prev,
          // update from game data without causing infinite loop
          ...data.players.reduce(
            (acc, { player }) => ({
              ...acc,
              [player._id]: true
            }),
            {}
          )
        }))
      ),
    [gameid]
  );

  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);

  const handleContinueButtonPress = () => {
    setContinueButtonDisabled(true);
    api.patch(`/games/${gameid}/players`, playerUpdates).then(() => {
      setContinueButtonDisabled(false);
      router.push(`/game/${gameid}/teamBuilder`);
    });
  };

  if (allPlayers === null) {
    return (
      <ThemedView>
        <ThemedText>Loading players&hellip;</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 justify-center p-4 space-y-4">
      <Button className="w-fit">
        <ButtonText>need 1</ButtonText>
      </Button>
      <FlatList
        data={allPlayers}
        renderItem={({ item: player }) => (
          <View style={{ flexDirection: 'row', gap: '1em' }}>
            <Checkbox
              value={playerUpdates[player._id]}
              onValueChange={(value) => {
                setPlayerUpdates({
                  ...playerUpdates,
                  [player._id]: value
                });
              }}
            />
            <ThemedText>{player.name}</ThemedText>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
      <Button
        disabled={continueButtonDisabled}
        onPress={handleContinueButtonPress}
      >
        <ButtonText>Continue</ButtonText>
      </Button>
    </ThemedView>
  );
}
