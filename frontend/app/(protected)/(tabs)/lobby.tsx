import { getGame } from '@/api/games';
import { IGame } from '@/api/types';
import { Text } from '@/components/ui/text';
import { Toast, useToast } from '@/components/ui/toast';
import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router/build/hooks';
import { FC, useEffect, useState } from 'react';

// enum LobbyState {
//   LAND,
//   JOIN,
//   CREATE,
//   ASSIGN,
//   PLAY,
//   END,
//   FINISH
// }

const Lobby: FC = () => {
  const toast = useToast();

  // get query string
  const globalSearchParams = useGlobalSearchParams();
  const rawId = globalSearchParams.gameid;
  // undefined = loading, null = none
  const [lobbyError, setLobbyError] = useState<string | null>(null);

  useEffect(() => {
    if (lobbyError === null) return;
    toast.show({
      id: Math.random().toString(),
      placement: 'top',
      duration: 3000,
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="error" variant="solid">
          <Text className="text-white">{lobbyError}</Text>
        </Toast>
      )
    });
    setLobbyError(null); // reset error after showing toast
  }, [lobbyError, toast]);

  const [game, setGame] = useState<IGame | null | undefined>(undefined);
  useEffect(() => {
    const id = (() => {
      if (rawId === undefined || rawId === 'undefined') return undefined;
      if (typeof rawId === 'string') return rawId;
      return rawId.at(-1); // if multiple ids are passed, take the last one
    })();
    if (id === undefined) {
      setGame(null);
      return;
    }
    getGame(id)
      .then((res) => setGame(res.data))
      .catch((err) => {
        if (!((isAxiosError(err) && err.status === 404) || err.status === 400))
          throw err;
        setLobbyError('Game not found');

        router.setParams({ gameid: undefined });
      });
    // toast causes render loop - ignore dependency
  }, [rawId]);

  if (game === undefined) return null; // clear the screen while the game loads
  return game === null ? 'create game' : 'joining game';
};

export default Lobby;
