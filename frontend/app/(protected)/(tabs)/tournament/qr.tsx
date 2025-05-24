import { View, Text } from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
  RelativePathString
} from 'expo-router';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon,
  Button,
  ButtonText,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  VStack,
  HStack
} from '@gluestack-ui/themed';
import { X, Hash } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useState } from 'react';
import { getTournament } from '@/api/tournament';
import { Toast, useToast } from '@/components/ui/toast';

export default function TournamentQRScreen() {
  const { tournamentId } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [manualTournamentId, setManualTournamentId] = useState('');

  const handleJoinTournament = async () => {
    if (!manualTournamentId.trim()) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'join-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <Text>Please enter a tournament ID</Text>
          </Toast>
        )
      });
      return;
    }

    try {
      // Verify the tournament exists
      await getTournament(manualTournamentId.trim());

      // Navigate to the tournament teams page
      router.push({
        pathname: '/tournament/teams',
        params: { tournamentId: manualTournamentId.trim() }
      } as unknown as RelativePathString);
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'join-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <Text>Invalid tournament ID. Please try again.</Text>
          </Toast>
        )
      });
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Modal isOpen={true}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader className="justify-end">
            <ModalCloseButton>
              <Icon
                as={X}
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack className="items-center justify-center gap-4">
              <QRCode value={tournamentId as string} size={200} />

              <View className="w-full mt-4">
                <Text className="text-center mb-2">
                  Or join by tournament ID:
                </Text>
                <HStack className="items-center gap-2">
                  <Input flex={1}>
                    <InputSlot>
                      <InputIcon as={Hash} />
                    </InputSlot>
                    <InputField
                      placeholder="Enter tournament ID"
                      value={manualTournamentId}
                      onChangeText={setManualTournamentId}
                    />
                  </Input>
                  <Button onPress={handleJoinTournament}>
                    <ButtonText>Join</ButtonText>
                  </Button>
                </HStack>
              </View>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </View>
  );
}
