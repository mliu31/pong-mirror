import { Button, SafeAreaView, View, StyleSheet, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import api from '@/api';
import { Player } from '@/api/types';
import { FlatList } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import { getAllPlayers } from '@/api/players';
import { getGame } from '@/api/games';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Route() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const [allPlayers, setAllPlayers] = useState<Player[] | null>(null);
  const [playerUpdates, setPlayerUpdates] = useState<
    Record<Player['_id'], boolean>
  >({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(
    () => void getAllPlayers().then(({ data }) => setAllPlayers(data)),
    []
  );

  useEffect(
    () =>
      void getGame(gameid).then(({ data }) =>
        setPlayerUpdates((prev) => ({
          ...prev,
          // update from game data without causing infinite loop
          ...data.players.reduce(
            (acc, { player }) => ({
              ...acc,
              [player._id]: true
            }),
            {}
          )
        }))
      ),
    [gameid]
  );

  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);

  const handleContinueButtonPress = () => {
    setContinueButtonDisabled(true);
    api.patch(`/games/${gameid}/players`, playerUpdates).then(() => {
      setContinueButtonDisabled(false);
      router.push(`/game/${gameid}/teamBuilder`);
    });
  };

  if (allPlayers === null) {
    return (
      <ThemedView>
        <ThemedText>Loading players&hellip;</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Add Players</ThemedText>

      {/* max 4 players popup if try to add >4 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View>
          <ThemedText>Max 4 players in a game</ThemedText>
          <Button title="Close modal" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={allPlayers}
            renderItem={({ item: player }) => (
              <View style={{ flexDirection: 'row', gap: '1em' }}>
                <Checkbox
                  value={playerUpdates[player._id] ?? false}
                  onValueChange={(value) => {
                    const trueCount =
                      Object.values(playerUpdates).filter((v) => v).length +
                      (value ? 1 : -1);

                    if (trueCount > 4) {
                      // cap of 4 players/game
                      setModalVisible(true);
                      return;
                    }

                    setPlayerUpdates({
                      ...playerUpdates,
                      [player._id]: value
                    });
                  }}
                />
                <ThemedText>{player.name}</ThemedText>
              </View>
            )}
            keyExtractor={(item) => item._id}
          />
          <Button
            disabled={continueButtonDisabled}
            onPress={handleContinueButtonPress}
            title="Save and continue"
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
    // backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  checkbox: {
    margin: 8
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paragraph: {
    fontSize: 15
  },
  indicatorStyle: {
    backgroundColor: '#000'
  }
});
