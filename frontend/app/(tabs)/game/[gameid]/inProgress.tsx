import { StyleSheet, Button, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

const styles = StyleSheet.create({
  playerViews: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: Dimensions.get('window').height / 10,
    paddingTop: Dimensions.get('window').height / 10
  },

  fixedButton: {
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0
  }
});

export default function InProgress() {
  const router = useRouter();
  return (
    <SafeAreaProvider>
      <View>
        <View style={styles.fixedButton}></View>
        <Button title="Back" onPress={() => router.back()}></Button>

        <View
          style={{ flexDirection: 'column', justifyContent: 'space-between' }}
        ></View>

        <View style={[styles.playerViews, { backgroundColor: '#D2042D' }]}>
          <ThemedText>Ethan and Jordan</ThemedText>
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Button
            title="Finish Game"
            onPress={() => router.push('./winner')}
          ></Button>
        </View>

        <View style={[styles.playerViews, { backgroundColor: '#0000FF' }]}>
          <ThemedText>Brian and Megan</ThemedText>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
