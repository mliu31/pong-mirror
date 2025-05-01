import { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, router } from 'expo-router';
import { getInvites } from '@/api/games';
import INVITE from '@/constants/INVITE';

export interface Invite {
  playerId: number;
  status: typeof INVITE;
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
    const interval = setInterval(fetchInvites, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [gameid]);

  const acceptedInvitesCount = invites.filter(
    (invite) => invite.status.toString() === INVITE.ACCEPTED
  ).length;

  return (
    <View>
      {invites.map((invite) => (
        <ThemedText key={invite.playerId}>
          Player ID: {invite.playerId}, Status: {invite.status.toString()}
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
