import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import INVITE from '@/constants/INVITE';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getPlayerInvites } from '@/api/invite';
import { ThemedText } from '@/components/ThemedText';

export interface PlayerInvite {
  gameId: string;
  status: typeof INVITE;
}

export default function Invite() {
  const [invites, setInvites] = useState<PlayerInvite[]>([]);

  const currentPlayerId = useSelector((state: RootState) => {
    return state.auth.basicPlayerInfo?._id;
  });

  const fetchInvites = async (pid: string) => {
    const res = await getPlayerInvites(pid);
    setInvites(res.data);
  };

  useEffect(() => {
    if (currentPlayerId) fetchInvites(currentPlayerId);
  }, [currentPlayerId]);

  if (!invites.length) return <Text>You have no invitations.</Text>;

  const handleGameAcceptReject = (gameid: string, accept: boolean) => {};

  return (
    <FlatList
      data={invites}
      keyExtractor={(invite) => invite.gameId.toString()}
      renderItem={({ item: invite }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          <ThemedText style={{ flex: 1 }}>Game: {invite.gameId}</ThemedText>
          <Button
            onPress={() => handleGameAcceptReject(invite.gameId, true)}
            style={{ marginRight: 5 }}
          >
            <ButtonText>accept</ButtonText>
          </Button>
          <Button onPress={() => handleGameAcceptReject(invite.gameId, false)}>
            <ButtonText>deny</ButtonText>
          </Button>
        </View>
      )}
    />
  );
}
