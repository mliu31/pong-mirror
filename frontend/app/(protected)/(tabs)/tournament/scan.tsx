import { Toast, useToast } from '@/components/ui/toast';
import { CameraView, ScanningResult } from 'expo-camera';
import { RelativePathString, useNavigation, useRouter } from 'expo-router';
import { ScanQrCode } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { Linking } from 'react-native';
import { getTournament } from '@/api/tournament';

export default function ScanTournament() {
  const router = useRouter();
  const navigation = useNavigation();
  const toast = useToast();
  const [lastQRValue, setLastQRValue] = useState<string | null>(null);

  const [cameraActive, setCameraActive] = useState(true);
  useEffect(
    () =>
      navigation.addListener('state', () =>
        setCameraActive(navigation.isFocused())
      ),
    [navigation]
  );

  const handleBarcodeScanned = async ({ data }: ScanningResult) => {
    console.log('handle tournament barcode scanned', data);
    // don't continue to scan the same QR code
    if (data === lastQRValue) {
      return;
    }
    setLastQRValue(data);

    try {
      const theirURL = new URL(data);
      const ourURL = new URL((await Linking.getInitialURL()) ?? '');
      if (theirURL.origin !== ourURL.origin) {
        return;
      }

      // Extract tournament ID from the URL path
      const tournamentId = theirURL.pathname.split('/').pop();
      if (!tournamentId) {
        throw new Error('Invalid tournament ID');
      }

      // Verify the tournament exists
      await getTournament(tournamentId);

      // Navigate to the tournament teams page
      router.push({
        pathname: '/tournament/teams',
        params: { tournamentId }
      } as unknown as RelativePathString);
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'scan-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <Text>
              Invalid tournament QR code, please use codes generated in the app!
            </Text>
          </Toast>
        )
      });
    }
  };

  const cameraViewRef = useRef<CameraView>(null);

  return (
    <View className="flex-1">
      {/* camera's active prop is not working, just stop rendering the camera */}
      {cameraActive && (
        <CameraView
          ref={cameraViewRef}
          barcodeScannerSettings={{
            barcodeTypes: ['qr']
          }}
          className="absolute w-full h-full"
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}
      <View className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit">
        <ScanQrCode size="100" />
      </View>
    </View>
  );
}
