import { CameraView } from 'expo-camera';

export default function JoinGame() {
  return (
    <CameraView
      barcodeScannerSettings={{
        barcodeTypes: ['qr']
      }}
      onBarcodeScanned={(scanningResult) => {
        // Handle the scanned QR code here
        console.log(scanningResult.data);
      }}
    />
  );
}
