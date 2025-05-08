import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, router } from 'expo-router';
import { getGameInvites } from '@/api/invite';
import INVITE from '@/constants/INVITE';
import { addPlayersToGame } from '@/api/games';
import { IInvite, IPlayer } from '@/api/types';
import { getPlayer } from '@/api/players';
import { Box } from '@/components/ui/box';

export default function Confirm() {
  const { gameid } = useLocalSearchParams<{ gameid: string }>();
  const [invites, setInvites] = useState<IInvite[]>([]);
  const [invitees, setInvitees] = useState<Record<string, IPlayer>>({});

  // fetch invites for game
  useEffect(() => {
    const fetchInvites = async () => {
      const res = await getGameInvites(gameid);
      setInvites(res.data);
    };
    fetchInvites();
    const interval = setInterval(fetchInvites, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [gameid]);

  // fetch player info for each invite
  useEffect(() => {
    Promise.all(invites.map((i) => getPlayer(i.playerId))).then((players) => {
      players.forEach((player) => {
        setInvitees((prev) => ({
          ...prev,
          [player.data._id]: player.data
        }));
      });
    });
  }, [invites]);

  // number of accepted invites
  const acceptedInvitesCount = invites.filter(
    (invite) => invite.status.toString() === INVITE.ACCEPTED
  ).length;

  // add all players to game
  const addPlayersToGameHandler = async () => {
    await addPlayersToGame(
      gameid,
      invites.map((invite) => invite.playerId)
    );
    router.push('./teamBuilder');
  };

  // box color for each invite
  const statusStyles: Record<string, string> = {
    [INVITE.ACCEPTED]: 'bg-green-700',
    [INVITE.PENDING]: 'bg-gray-500',
    [INVITE.DECLINED]: 'bg-red-500'
  };

  const renderItem = ({ item }: { item: IInvite }) => {
    return (
      <Box className="flex flex-row justify-between items-center p-7 pt-0">
        <ThemedText className="text-base">
          {invitees[item.playerId]?.name}
        </ThemedText>

        <Box>
          <ThemedText
            className={`${statusStyles[item.status.toString()]} px-3 py-1 rounded-full`}
          >
            {item.status.toString()}
          </ThemedText>
        </Box>
      </Box>
    );
  };

  return (
    <View>
      <Box className="flex-row p-7 justify-start">
        <ThemedText className="font-bold text-xl">Player</ThemedText>
        <ThemedText className="ml-auto font-bold text-xl">Status</ThemedText>
      </Box>
      <FlatList
        data={invites}
        keyExtractor={(item) => item.playerId.toString()}
        renderItem={renderItem}
      />
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
