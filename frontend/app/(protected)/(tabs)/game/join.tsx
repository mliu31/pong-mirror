import { CameraView } from 'expo-camera';
import { ScanQrCode } from 'lucide-react-native';
import { View } from 'react-native';

export default function JoinGame() {
  return (
    <View className="flex-1">
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['qr']
        }}
        className="absolute w-full h-full"
        onBarcodeScanned={(scanningResult) => {
          // Handle the scanned QR code here
          console.log(scanningResult.data);
        }}
      />
      <View className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit">
        <ScanQrCode size="100" />
      </View>
    </View>
  );
}
