import { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, router } from 'expo-router';
import { getInvites } from '@/api/games';

export interface Invite {
  playerId: number;
  status: string;
}
export default function Confirm() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    const fetchInvites = async () => {
      const res = await getInvites(gameid);
      setInvites(res.data);
    };

    fetchInvites();
  }, [gameid]);

  // const allAccepted = invites.every((i) => i.status === 'accepted');

  return (
    <View>
      {invites.map((invite) => (
        <ThemedText key={invite.playerId}>
          Player ID: {invite.playerId}, Status: {invite.status}
        </ThemedText>
      ))}
      {/* <FlatList
        data={invites}
        keyExtractor={(item) => item.playerId.toString()}
        renderItem={({ item }) => <Text>Player ID: {item.playerId}</Text>}
      /> */}
      <Button onPress={() => router.back()}>
        <ButtonText>Continue</ButtonText>
      </Button>
    </View>
  );
}
