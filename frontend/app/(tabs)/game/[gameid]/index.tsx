import { Button, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import api from '@/api';
import { Game, Player } from '@/api/types';
import { FlatList } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';

export default function Route() {
  const { gameid } = useLocalSearchParams();
  const [allPlayers, setAllPlayers] = useState<Player[] | null>(null);
  const [playerUpdates, setPlayerUpdates] = useState<
    Record<Player['_id'], boolean>
  >({});

  useEffect(
    () => void api.get(`/players`).then(({ data }) => setAllPlayers(data)),
    []
  );

  useEffect(() => {
    void api.get(`/games/${gameid}`).then(({ data }) =>
      setPlayerUpdates((prev) => ({
        ...prev,
        // update from game data without causing infinite loop
        ...(data as Game).players.reduce(
          (acc, { player }) => ({
            ...acc,
            [player._id]: true
          }),
          {}
        )
      }))
    );
  }, [gameid]);

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
    <ThemedView>
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
        title="Save and continue"
      />
    </ThemedView>
  );
}
