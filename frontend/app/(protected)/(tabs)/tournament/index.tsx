import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, CameraView, ScanningResult } from 'expo-camera';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/redux-hooks';
import { createTournament, addTeam } from '@/api/tournament';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function TournamentScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCreateTournament = async () => {
    try {
      const tournament = await createTournament('New Tournament');
      router.push(`/tournament/${tournament._id}`);
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  const handleJoinTournament = () => {
    setScannerVisible(true);
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
        className="w-full"
        onPress={handleJoinTournament}
      >
        <ButtonText>Join Tournament</ButtonText>
      </Button>
    </ThemedView>
  );
}
