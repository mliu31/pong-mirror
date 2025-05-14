import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, CameraView, ScanningResult } from 'expo-camera';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/redux-hooks';
import { createTournament, addTeam } from '@/api/tournament';

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
      const tournament = await createTournament(basicPlayerInfo?._id || '');
      router.push({
        pathname: '/tournament/qr',
        params: { tournamentId: tournament._id }
      });
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
      router.push({
        pathname: '/tournament/teams',
        params: { tournamentId }
      });
    } catch (error) {
      console.error('Error joining tournament:', error);
    }
  };

  if (scannerVisible) {
    if (hasPermission === null) {
      return <Text>Requesting camera permission...</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr']
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setScannerVisible(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournament</Text>
      <TouchableOpacity style={styles.button} onPress={handleCreateTournament}>
        <Text style={styles.buttonText}>Create Tournament</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleJoinTournament}>
        <Text style={styles.buttonText}>Join Tournament</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
    width: '80%'
  }
});
