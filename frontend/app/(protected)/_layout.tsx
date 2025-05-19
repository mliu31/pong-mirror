import { useAppSelector } from '@/redux/redux-hooks';
import { Redirect, router, Slot, Stack, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPlayerInvites } from '@/api/invite';
import { IInvite } from '@/api/types';
import InvitesContext from '@/context/InviteContext';
import { Button } from '@/components/ui/button';
import { CloseIcon, Icon } from '@/components/ui/icon';

export default function ProtectedLayout() {
  // TODO: flesh out route protection
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);
  const pid = basicPlayerInfo?._id;
  const [checking, setChecking] = useState(true);
  const [invites, setInvites] = useState<IInvite[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // If not logged in, stop checking so we hit the <Redirect>
    if (!basicPlayerInfo) {
      setChecking(false);
      return;
    }

    // Else, async check for invites
    const checkInvites = async () => {
      const pid = basicPlayerInfo?._id;
      try {
        // fetch pending invites for this player
        const invites = (await getPlayerInvites(pid)).data;
        setInvites(invites);
        if (invites.length > 0 && pathname !== '/invite') {
          router.replace('/invite');
          return; // don’t fall through to <Slot />
        }
      } catch (err) {
        console.error('Invite‐check failed', err);
      } finally {
        setChecking(false);
      }
    };

    checkInvites();
    const intervalId = setInterval(checkInvites, 3000); // check every 3s

    return () => {
      clearInterval(intervalId); // cleanup
    };
  }, [basicPlayerInfo, pathname, pid]);

  // show login screen if not logged in
  if (!basicPlayerInfo) {
    return (
      <Redirect
        href={{
          pathname: '/login',
          params: {
            next: pathname
          }
        }}
      />
    );
  }

  // show nothing (or a loader) while we’re deciding page to show
  if (checking) {
    return null;
  }

  // no pending invites → render whatever protected screen they asked for
  return (
    <InvitesContext.Provider value={{ invites, setInvites }}>
      <Stack>
        {/* tab navigator, no header */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* invite screen */}
        <Stack.Screen
          name="invite"
          options={{
            title: 'Pending Invites',
            headerRight:
              invites.length === 0
                ? () => (
                    <Button
                      onPress={() => router.replace('/')}
                      className="mr-2 bg-transparent"
                    >
                      <Icon
                        as={CloseIcon}
                        size="xl"
                        className="text-typography-500"
                      />
                    </Button>
                  )
                : undefined
          }}
        />
        <Slot />
      </Stack>
    </InvitesContext.Provider>
  );
}
