import { View, StyleSheet, Modal } from 'react-native';
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
  CheckboxIcon
} from '@/components/ui/checkbox';
import { VStack } from '@/components/ui/vstack';
import { CheckIcon } from '@/components/ui/icon';
import { FlatList, ScrollView } from 'react-native';

export default function Route() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const [allPlayers, setAllPlayers] = useState<Player[] | null>(null);
  const [playerUpdates, setPlayerUpdates] = useState<
    Record<Player['_id'], boolean>
  >({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(
    () => void getAllPlayers().then(({ data }) => setAllPlayers(data)),
    []
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

  const renderItem = ({ item: player }: { item: Player }) => {
    const handleCheckboxChange = (isSelected: boolean) => {
      // Count how many players are currently selected
      const currentSelectedCount = Object.values(playerUpdates).filter(
        (v) => v === true
      ).length;

      // If trying to select and already at 4 players, show modal and prevent selection
      if (isSelected && currentSelectedCount >= 4) {
        setModalVisible(true);
        return;
      }

      // Otherwise update the state
      setPlayerUpdates((prev) => ({
        ...prev,
        [player._id]: isSelected
      }));
    };

    return (
      <Checkbox
        value={player._id}
        // Explicitly handle undefined with a default false value
        isChecked={playerUpdates[player._id] === true}
        onChange={handleCheckboxChange}
      >
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>
          <ThemedText>{player.name}</ThemedText>
        </CheckboxLabel>
      </Checkbox>
    );
  };

  return (
    <ThemedView className="flex-1 justify-center p-4 space-y-4">
      <ThemedText>Add Players</ThemedText>

      {/* max 4 players popup if try to add >4 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View>
          <ThemedText>Max 4 players in a game</ThemedText>
          <Button onPress={() => setModalVisible(false)}>
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </Modal>

      <ScrollView className="flex-1">
        <VStack space="md" className="flex-1">
          <FlatList
            data={allPlayers}
            className="flex-1"
            keyExtractor={(player) => player._id}
            renderItem={renderItem}
          />
        </VStack>
      </ScrollView>

      <Button
        disabled={continueButtonDisabled}
        onPress={handleContinueButtonPress}
      >
        <ButtonText>Save and continue</ButtonText>
      </Button>
    </ThemedView>
  );
}
