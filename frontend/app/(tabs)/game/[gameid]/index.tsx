import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import api from '@/api';
import { Player } from '@/api/types';
import { getAllPlayers } from '@/api/players';
import { Button, ButtonText } from '@/components/ui/button';
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription
} from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { CheckIcon } from '@/components/ui/icon';
import { FlatList, ScrollView } from 'react-native';

export default function Route() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const [allPlayers, setAllPlayers] = useState<Player[] | null>(null);
  const [playerUpdates, setPlayerUpdates] = useState<
    Record<Player['_id'], boolean>
  >({});
  const [numSelectedPlayers, setNumSelectedPlayers] = useState(0);

  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const handleToast = () => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast();
    }
  };

  const showNewToast = () => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id;
        return (
          <Toast nativeID={uniqueToastId} action="error" variant="solid">
            <ToastTitle>Max 4 players in a game</ToastTitle>
          </Toast>
        );
      }
    });
  };

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
    const playerButtonPressHandler = () => {
      // If trying to select and already at 4 players
      const isSelected = playerUpdates[player._id] === true; // allow for deselection
      if (numSelectedPlayers == 4 && !isSelected) {
        handleToast();
        return;
      }

      // Otherwise update states
      if (isSelected) {
        setNumSelectedPlayers((prev) => prev - 1);
      } else {
        setNumSelectedPlayers((prev) => prev + 1);
      }

      setPlayerUpdates((prev) => ({
        ...prev,
        [player._id]: !prev[player._id]
      }));
    };

    return (
      <Button
        size="md"
        action="primary"
        onPress={playerButtonPressHandler}
        variant={playerUpdates[player._id] === true ? 'solid' : 'outline'}
        className={`border-0 border-b rounded-none ${
          playerUpdates[player._id] === true ? 'border-black' : ''
        }`}
      >
        <ButtonText>{player.name}</ButtonText>
      </Button>
    );
  };

  return (
    <ThemedView className="flex-1 justify-center p-4 space-y-4">
      <ThemedText>Add Players</ThemedText>
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
