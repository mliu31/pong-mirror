import { useContext, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import INVITE, { InviteValue } from '@/constants/INVITE';
import type { IInvite } from '@/api/types';
import { getPlayerInvites, setPlayerInvite } from '@/api/invite';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Icon, CheckIcon, SlashIcon } from '@/components/ui/icon';
import InviteContext from '@/context/InviteContext';
import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';

export default function Invite() {
  const { invites, setInvites } = useContext(InviteContext);

  const currentPlayerId = useLoggedInPlayer()._id;

  // when get logged in player, fetch invites
  useEffect(() => {
    if (!currentPlayerId) return;

    (async () => {
      const { data: invites } = await getPlayerInvites(currentPlayerId);
      setInvites(invites);
    })();
  }, [currentPlayerId, setInvites]);

  const handleGameAcceptReject = async (
    gameid: string,
    status: InviteValue
  ) => {
    if (currentPlayerId) {
      await setPlayerInvite(currentPlayerId, gameid, status);
    } else {
      console.error('currentPlayerId is undefined');
    }
    setInvites(
      invites.filter((invite: IInvite) => invite.gameId._id !== gameid)
    );
  };

  const renderItem = ({ item }: { item: IInvite }) => (
    <ThemedView className="flex-row items-center pb-4">
      <ThemedText className="flex-1 text-base text-lg">
        {`${item.gameId.captain.name}'s game`}
      </ThemedText>

      <ThemedView className="flex-row space-x-2 ml-auto">
        <Button
          onPress={() =>
            handleGameAcceptReject(item.gameId._id.toString(), INVITE.ACCEPTED)
          }
          className="bg-green-700"
        >
          <ButtonText>
            <Icon as={CheckIcon} className="text-gray-300 m-2 w-5 h-5" />
          </ButtonText>
        </Button>
        <Button
          onPress={() =>
            handleGameAcceptReject(item.gameId._id.toString(), INVITE.DECLINED)
          }
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
          <ThemedText className="text-lg pb-4">None pending</ThemedText>
          {/* <Button onPress={() => router.replace('/')}>
            <ButtonText>Exit</ButtonText>
          </Button> */}
        </ThemedView>
      ) : (
        <FlatList
          data={invites}
          keyExtractor={(invite) => invite._id.toString()}
          renderItem={renderItem}
        />
      )}
    </ThemedView>
  );
}
