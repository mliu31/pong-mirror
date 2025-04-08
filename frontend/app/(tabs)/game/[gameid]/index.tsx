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

  useEffect(
    () => void getAllPlayers().then(({ data }) => setAllPlayers(data)),
    []
  );

  useEffect(
    () =>
      void getGame(gameid).then(({ data }) =>
        setPlayerUpdates((prev) => ({
          ...data.players.reduce(
            (acc, { player }) => ({
              ...acc,
              [player._id]: true
            }),
            {}
          ),
          ...prev
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

  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  navigation.setOptions({
    headerTitle: 'Select players',
    headerRight: () => (
      <>
        <Button
          size="lg"
          className="rounded-full p-2  mr-4 w-10 h-10"
          onPress={() => {
            setShowModal(true);
          }}
        >
          {/* while this should be buttonIcon, stroke wasn't working with the lucide icon and it needs current color */}
          <ButtonText>
            <QrCodeIcon className="stroke-current" />
          </ButtonText>
        </Button>
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          size="sm"
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader className="justify-end">
              <ModalCloseButton>
                <Icon
                  as={CloseIcon}
                  size="md"
                  className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <View className="items-center justify-center">
                <QRCode
                  value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  size={200}
                />
              </View>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  });

  if (allPlayers === null) {
    return (
      <ThemedView>
        <ThemedText>Loading players&hellip;</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 justify-center p-4 space-y-4">
      <ScrollView className="flex-1">
        <VStack space="md" className="flex-1">
          <FlatList
            data={allPlayers}
            className="flex-1"
            keyExtractor={(player) => player._id}
            renderItem={({ item: player }) => (
              <Checkbox
                key={player._id}
                value={player._id}
                isChecked={playerUpdates[player._id]}
                onChange={(isSelected) => {
                  setPlayerUpdates((prev) => ({
                    ...prev,
                    [player._id]: isSelected
                  }));
                }}
              >
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
