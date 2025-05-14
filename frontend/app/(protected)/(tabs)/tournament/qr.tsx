import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon
} from '@gluestack-ui/themed';
import { CloseIcon } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

export default function TournamentQRScreen() {
  const { tournamentId } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center">
      <Modal isOpen={true} size="sm">
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
              <QRCode value={tournamentId as string} size={200} />
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </View>
  );
}
