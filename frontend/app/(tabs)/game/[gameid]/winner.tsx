import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { BackButton } from '../../../../components/BackButton';
import ClickWinner from './clickWinner';

export default function WinnerScreen() {
  const { gameid } = useLocalSearchParams() as { gameid: string };

  return (
    <SafeAreaProvider>
      <View>
        <BackButton></BackButton>
        <View
          style={{ flexDirection: 'column', justifyContent: 'space-between' }}
        ></View>
        <ClickWinner teamColor="RED" gameid={gameid} />
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <ThemedText>Select Winner</ThemedText>
        </View>
        <ClickWinner teamColor="BLUE" gameid={gameid} />
      </View>
    </SafeAreaProvider>
  );
}
