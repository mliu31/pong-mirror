import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { IPlayer } from '@/api/types';
import { getAllPlayers } from '@/api/players';
import { Button, ButtonText } from '@/components/ui/button';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { FlatList, ScrollView, View } from 'react-native';
import { QrCode as QrCodeIcon } from 'lucide-react-native';
import { CloseIcon, Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader
} from '@/components/ui/modal';
import QRCode from 'react-native-qrcode-svg';
import { invitePlayersToGame } from '@/api/invite';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function Route() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const playerId = useSelector(
    (state: RootState) => state.auth.basicPlayerInfo?._id
  );

  const [allPlayers, setAllPlayers] = useState<IPlayer[]>();
  const [playerUpdates, setPlayerUpdates] = useState<
    Record<IPlayer['_id'], boolean>
  >({ [playerId]: true });
  const [numSelectedPlayers, setNumSelectedPlayers] = useState(1);
  const [isUpdatingPlayers, setIsUpdatingPlayers] = useState(false);
  const shouldDisableContinueButton =
    numSelectedPlayers < 2 || isUpdatingPlayers;

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

  useEffect(() => {
    void getAllPlayers().then(({ data }) => {
      // move logged in user to the top of list
      const filteredPlayers = data.filter((player) => player._id !== playerId);
      const currentPlayer = data.find((player) => player._id === playerId);
      setAllPlayers([currentPlayer, ...filteredPlayers]);
    });
  }, []);

  const handleContinueButtonPress = async () => {
    setIsUpdatingPlayers(true);
    const selectedPlayerIds = Object.keys(playerUpdates).filter(
      (playerId) => playerUpdates[playerId] // convert playerUpdates to array of pids
    );
    const filteredPlayerIds = selectedPlayerIds.filter((id) => id !== playerId); // don't invite captain bc alr in game
    await invitePlayersToGame(gameid, filteredPlayerIds);
    setIsUpdatingPlayers(false);
    router.push(`/game/${gameid}/confirm`);
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

  const renderItem = ({ item: player }: { item: IPlayer }) => {
    const playerButtonPressHandler = () => {
      if (player._id === playerId) return;

      // If trying to select and already at 4 players
      const isSelected = playerUpdates[player._id] === true; // allow for deselection
      if (numSelectedPlayers === 4 && !isSelected) {
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
    // TODO: add searchbar
    <ThemedView className="flex-1 justify-center p-4 space-y-4">
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
        onPress={handleContinueButtonPress}
        disabled={shouldDisableContinueButton}
        action={shouldDisableContinueButton ? 'secondary' : 'primary'}
        className={shouldDisableContinueButton ? '' : 'bg-success-300'}
      >
        <ButtonText>Continue</ButtonText>
      </Button>
    </ThemedView>
  );
}
