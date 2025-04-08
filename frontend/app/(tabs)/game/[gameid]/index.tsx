import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import api from '@/api';
import { Player } from '@/api/types';
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
