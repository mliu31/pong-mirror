import { ThemedView } from '@/components/ThemedView';
import { CameraView } from 'expo-camera';

export default function JoinGame() {
  return (
    <ThemedView>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['qr']
        }}
      />
    </ThemedView>
  );
}
