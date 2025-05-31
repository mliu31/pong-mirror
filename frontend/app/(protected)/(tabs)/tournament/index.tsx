import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, CameraView, ScanningResult } from 'expo-camera';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/redux-hooks';
import { createTournament, addTeam, getTournament } from '@/api/tournament';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
  HStack
} from '@gluestack-ui/themed';
import { Hash } from 'lucide-react-native';
import { Toast, useToast } from '@/components/ui/toast';

export default function TournamentScreen() {
  const router = useRouter();
  const toast = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [manualTournamentId, setManualTournamentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);
  console.log('basicPlayerInfo');
  console.log(basicPlayerInfo);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCreateTournament = async () => {
    try {
      const tournament = await createTournament(
        'New Tournament',
        basicPlayerInfo?._id || ''
      );
      router.push(`/tournament/${tournament._id}`);
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  const handleJoinTournament = () => {
    setScannerVisible(true);
  };

  const handleManualJoin = async () => {
    const trimmedId = manualTournamentId.trim();
    if (!trimmedId) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'join-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>Please enter a tournament ID</ThemedText>
          </Toast>
        )
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verify the tournament exists
      await getTournament(trimmedId);
      // Add the player to the tournament
      await addTeam(
        trimmedId,
        basicPlayerInfo?._id || '',
        basicPlayerInfo?.name || ''
      );
      router.push(`/tournament/${trimmedId}`);
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'join-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>Invalid tournament ID. Please try again.</ThemedText>
          </Toast>
        )
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarCodeScanned = async ({ data }: ScanningResult) => {
    try {
      const tournamentId = data;
      await addTeam(tournamentId, basicPlayerInfo?._id || '');
      router.push(`/tournament/${tournamentId}`);
    } catch (error) {
      console.error('Error joining tournament:', error);
    }
  };

  if (scannerVisible) {
    if (hasPermission === null) {
      return <ThemedText>Requesting camera permission...</ThemedText>;
    }
    if (hasPermission === false) {
      return <ThemedText>No access to camera</ThemedText>;
    }

    return (
      <ThemedView className="flex-1">
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr']
          }}
          className="absolute w-full h-full"
        />
        <Button
          action="primary"
          variant="solid"
          size="lg"
          className="absolute bottom-10 w-4/5 self-center"
          onPress={() => setScannerVisible(false)}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 items-center justify-center p-5">
      <ThemedText type="title" className="mb-8">
        Tournament
      </ThemedText>
      <Button
        action="primary"
        variant="solid"
        size="lg"
        className="w-full mb-4"
        onPress={handleCreateTournament}
      >
        <ButtonText>Create Tournament</ButtonText>
      </Button>
      <Button
        action="primary"
        variant="solid"
        size="lg"
        className="w-full mb-4"
        onPress={handleJoinTournament}
      >
        <ButtonText>Scan QR Code</ButtonText>
      </Button>

      <View className="w-full mb-4">
        <ThemedText className="text-center mb-2">
          Or enter tournament ID:
        </ThemedText>
        <HStack className="items-center gap-2">
          <Input flex={1}>
            <InputSlot>
              <InputIcon as={Hash} />
            </InputSlot>
            <InputField
              placeholder="Enter tournament ID"
              value={manualTournamentId}
              onChangeText={setManualTournamentId}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="join"
              onSubmitEditing={handleManualJoin}
            />
          </Input>
          <Button
            action="primary"
            variant="solid"
            size="lg"
            onPress={handleManualJoin}
            isDisabled={isLoading}
          >
            <ButtonText>{isLoading ? 'Joining...' : 'Join'}</ButtonText>
          </Button>
        </HStack>
      </View>
    </ThemedView>
  );
}
