import { IInvite } from '@/api/types';
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useIo } from '../context/IoContext';
import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import { Link } from 'expo-router';
import { IOInviteEvent } from '@/api/messageTypes';
import InviteContext from '@/context/InviteContext';
import { getPlayerInvites } from '@/api/invite';
import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';

const InviteProvider: FC<PropsWithChildren> = ({ children }) => {
  const [invites, setInvites] = useState<IInvite[]>([]);

  const io = useIo();
  const toast = useToast();
  const pid = useLoggedInPlayer()._id;

  const refreshInvites = useCallback(
    () =>
      getPlayerInvites(pid)
        .then((res) => setInvites(res.data))
        .catch((err) => console.error('Failed to refresh invites', err)),
    [pid, setInvites]
  );

  // fetch invites on mount
  useEffect(() => {
    return void refreshInvites();
  }, [refreshInvites]);

  const showInvite = useCallback(
    async ({ captainName }: IOInviteEvent['data']) => {
      await refreshInvites();
      return toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Link href="/game/join" onPress={() => toast.close(id)}>
            <Toast
              nativeID={`toast-${id}`}
              className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
            >
              <ToastTitle size="sm">
                {captainName} invited you to join their game!
              </ToastTitle>
            </Toast>
          </Link>
        )
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (io === undefined) return;
    io.on('invite', showInvite);
    return () => {
      io.off('invite', showInvite);
    };
  }, [io, showInvite]);

  return (
    <InviteContext.Provider value={{ invites, setInvites, refreshInvites }}>
      {children},
    </InviteContext.Provider>
  );
};

export default InviteProvider;
