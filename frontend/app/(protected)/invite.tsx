import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from '@/components/ui/button';
import api from '@/api'; // axios instance pointed at your backend
import { router } from 'expo-router';
import INVITE from '@/constants/INVITE';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getPlayerInvites } from '@/api/invite';
import { ThemedText } from '@/components/ThemedText';

export interface PlayerInvite {
  gameId: number;
  status: typeof INVITE;
}

export default function Invite() {
  const [invites, setInvites] = useState<PlayerInvite[]>([]);

  // const currentPlayerId = useSelector((state: RootState) => {
  //   console.log(state.auth?.basicPlayerInfo); // Check if `basicPlayerInfo` exists
  //   return state.auth.basicPlayerInfo?._id;
  // });

  const fetchInvites = async (pid: string) => {
    const res = await getPlayerInvites(pid);
    console.log(res.data);
    setInvites(res.data);
  };

  const currentPlayerId = '67b3935b7cf6fef618ed4890';
  useEffect(() => {
    console.log('logged in playerId:', currentPlayerId);
    if (currentPlayerId) fetchInvites(currentPlayerId);
  }, [currentPlayerId]);

  // const respond = async (id: string, accept: boolean) => {
  //   await api.post(`/invitations/${id}/${accept ? 'accept' : 'decline'}`);
  //   fetchInvites();
  // };

  if (!invites.length) return <Text>You have no invitations.</Text>;

  return (
    <View>
      {invites.map((invite) => (
        <ThemedText key={invite.gameId}>
          game: {invite.gameId}, Status: {invite.status.toString()}
        </ThemedText>
      ))}
    </View>
  );
}
