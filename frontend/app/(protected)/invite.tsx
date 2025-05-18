import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import INVITE, { InviteValue } from '@/constants/INVITE';
import type { IInvite } from '@/api/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getPlayerInvites, setPlayerInvite } from '@/api/invite';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { getGame } from '@/api/games';
import { getPlayer } from '@/api/players';
import { ThemedView } from '@/components/ThemedView';
import { Icon, CheckIcon, SlashIcon } from '@/components/ui/icon';

export default function Invite() {
  const [invites, setInvites] = useState<IInvite[]>([]);
  const [gameInviteToCaptName, setGameInviteToCaptName] = useState<
    Record<string, string>
  >({});

  const currentPlayerId = useSelector((state: RootState) => {
    return state.auth.basicPlayerInfo?._id;
  });

  // when get logged in player, fetch invites
  useEffect(() => {
    if (!currentPlayerId) return;

    (async () => {
      const { data: invites } = await getPlayerInvites(currentPlayerId);
      setInvites(invites);

      const gameToCapt = await Promise.all(
        invites.map(async (invite) => {
          const { data: game } = await getGame(invite.gameId);
          const { data: player } = await getPlayer(game.captain);

          return [game._id as string, player.name as string];
        })
      );

      setGameInviteToCaptName(Object.fromEntries(gameToCapt));
    })();
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
    setInvites((prevInvites) =>
      prevInvites.filter((invite) => invite.gameId !== gameid)
    );
  };

  const renderItem = ({ item }: { item: IInvite }) => (
    <ThemedView className="flex-row items-center pb-4">
      <ThemedText className="flex-1 text-base text-lg">
        {`${gameInviteToCaptName[item.gameId]}'s game`}
      </ThemedText>

      <ThemedView className="flex-row space-x-2 ml-auto">
        <Button
          onPress={() => handleGameAcceptReject(item.gameId, INVITE.ACCEPTED)}
          className="bg-green-700"
        >
          <ButtonText>
            <Icon as={CheckIcon} className="text-gray-300 m-2 w-5 h-5" />
          </ButtonText>
        </Button>
        <Button
          onPress={() => handleGameAcceptReject(item.gameId, INVITE.DECLINED)}
          className="bg-red-500"
        >
          <ButtonText>
            <Icon as={SlashIcon} className="text-gray-300 m-2 w-5 h-5" />
          </ButtonText>
        </Button>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView className="flex-1 p-4">
      {invites.length === 0 ? (
        <ThemedView className="flex-1 justify-between">
          <ThemedText className="text-lg pb-4">No pending invites</ThemedText>
          <Button onPress={() => router.replace('/')}>
            <ButtonText>Exit</ButtonText>
          </Button>
        </ThemedView>
      ) : (
        <FlatList
          data={invites}
          keyExtractor={(invite) => invite.gameId.toString()}
          renderItem={renderItem}
        />
      )}
    </ThemedView>
  );
}
