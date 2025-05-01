import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import INVITE, { InviteValue } from '@/constants/INVITE';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getPlayerInvites, setPlayerInvite } from '@/api/invite';
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

  const handleGameAcceptReject = async (
    gameid: string,
    status: InviteValue
  ) => {
    if (currentPlayerId) {
      await setPlayerInvite(currentPlayerId, gameid, status);
    } else {
      console.error('currentPlayerId is undefined');
    }
  };

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
            onPress={() =>
              handleGameAcceptReject(invite.gameId, INVITE.ACCEPTED)
            }
            style={{ marginRight: 5 }}
          >
            <ButtonText>accept</ButtonText>
          </Button>
          <Button
            onPress={() =>
              handleGameAcceptReject(invite.gameId, INVITE.DECLINED)
            }
          >
            <ButtonText>deny</ButtonText>
          </Button>
        </View>
      )}
    />
  );
}
