import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { Game } from '@/api/apiTypes';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';

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
  const local = useLocalSearchParams();
  const [gameData, setGameData] = useState<Game | null>(null);
  const [leftTeam, setLeftTeam] = useState<string[]>([]);
  const [rightTeam, setRightTeam] = useState<string[]>([]);

  useEffect(() => {
    getGame(local.gameid as string).then((res) =>
      setGameData(res.data as Game)
    );
  }, [local.gameid]);

  return (
    <SafeAreaProvider>
      <View>
        <View style={styles.fixedButton}></View>
        <View
          style={{ flexDirection: 'column', justifyContent: 'space-between' }}
        ></View>

        <View style={[styles.playerViews, { backgroundColor: '#D2042D' }]}>
          <ThemedText>Ethan and Jordan</ThemedText>
        </View>

        <View style={[styles.playerViews, { backgroundColor: '#0000FF' }]}>
          <ThemedText>Brian and Megan</ThemedText>
        </View>
      </View>

      <Box className="justify-center px-4 pb-4 mt-auto">
        <ThemedText className="text-center text-typography-950 text-lg mb-2">
          May the best team win...
        </ThemedText>

        <Button
          onPress={() => router.push('./winner')}
          action="primary"
          variant="solid"
          size="md"
        >
          <ButtonText>End game</ButtonText>
        </Button>
      </Box>
    </SafeAreaProvider>
  );
}
