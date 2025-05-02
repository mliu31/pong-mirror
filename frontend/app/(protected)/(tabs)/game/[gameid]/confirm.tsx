import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, router } from 'expo-router';
import { getGameInvites } from '@/api/invite';
import INVITE from '@/constants/INVITE';
import { addPlayersToGame } from '@/api/games';
import { IInvite } from '@/api/types';

export default function Confirm() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const [invites, setInvites] = useState<IInvite[]>([]);

  useEffect(() => {
    const fetchInvites = async () => {
      const res = await getGameInvites(gameid);
      setInvites(res.data);
    };
    fetchInvites();
    const interval = setInterval(fetchInvites, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [gameid]);

  const acceptedInvitesCount = invites.filter(
    (invite) => invite.status.toString() === INVITE.ACCEPTED
  ).length;

  const addPlayersToGameHandler = async () => {
    await addPlayersToGame(
      gameid,
      invites.map((invite) => invite.playerId)
    );
    router.push('./teamBuilder');
  };

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
      <Button
        onPress={addPlayersToGameHandler}
        disabled={acceptedInvitesCount !== invites.length}
        action={
          acceptedInvitesCount !== invites.length ? 'secondary' : 'primary'
        }
        className={
          acceptedInvitesCount !== invites.length ? '' : 'bg-success-300'
        }
      >
        <ButtonText>Continue</ButtonText>
      </Button>
    </View>
  );
}
