import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import api from '@/api';
import { Player } from '@/api/types';
import { FlatList } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';

export default function Route() {
  const local = useLocalSearchParams();
  const [allPlayers, setAllPlayers] = useState<Player[] | null>(null);
  useEffect(
    () => void api.get(`/players`).then(({ data }) => setAllPlayers(data)),
    []
  );
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<
    Record<Player['_id'], boolean>
  >({});

  if (allPlayers === null) {
    return (
      <ThemedView>
        <ThemedText>Loading players&hellip;</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <FlatList
        data={allPlayers}
        renderItem={({ item: player }) => (
          <View style={{ flexDirection: 'row', gap: '1em' }}>
            <Checkbox
              value={selectedPlayerIds[player._id]}
              onValueChange={(value) => {
                setSelectedPlayerIds({
                  ...selectedPlayerIds,
                  [player._id]: value
                });
              }}
            />
            <ThemedText>{player.name}</ThemedText>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </ThemedView>
  );
}
