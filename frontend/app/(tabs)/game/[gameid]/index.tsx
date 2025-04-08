import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import api from '@/api';
import { Player } from '@/api/types';
import { getAllPlayers } from '@/api/players';
import { getGame } from '@/api/games';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
  CheckboxGroup
} from '@/components/ui/checkbox';
import { VStack } from '@/components/ui/vstack';
import { CheckIcon } from '@/components/ui/icon';
import { View, FlatList, ScrollView } from 'react-native';

export default function Route() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const [allPlayers, setAllPlayers] = useState<Player[] | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  useEffect(
    () => void getAllPlayers().then(({ data }) => setAllPlayers(data)),
    []
  );

  useEffect(
    () =>
      void getGame(gameid).then(({ data }) => {
        // Extract player IDs from game data
        const playerIds = data.players.map(({ player }) => player._id);
        setSelectedPlayers(playerIds);
      }),
    [gameid]
  );

  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);

  const handleContinueButtonPress = () => {
    setContinueButtonDisabled(true);
    // Convert selected player IDs to the format the API expects
    const playerUpdates = allPlayers?.reduce(
      (acc, player) => ({
        ...acc,
        [player._id]: selectedPlayers.includes(player._id)
      }),
      {}
    );

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

      <ScrollView className="flex-1">
        <CheckboxGroup value={selectedPlayers} onChange={setSelectedPlayers}>
          <VStack space="md" className="flex-1">
            <FlatList
              data={allPlayers}
              className="flex-1"
              keyExtractor={(player) => player._id}
              renderItem={({ item: player }) => (
                <Checkbox key={player._id} value={player._id}>
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>
                    <ThemedText>{player.name}</ThemedText>
                  </CheckboxLabel>
                </Checkbox>
              )}
            />
          </VStack>
        </CheckboxGroup>
      </ScrollView>

      <Button
        disabled={continueButtonDisabled}
        onPress={handleContinueButtonPress}
      >
        <ButtonText>Continue</ButtonText>
      </Button>
    </ThemedView>
  );
}
