import { useAppSelector } from '@/redux/redux-hooks';
import { router, Stack, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPlayerInvites } from '@/api/invite';
import { IInvite } from '@/api/types';
import InvitesContext from '@/context/InviteContext';
import { Button } from '@/components/ui/button';
import { CloseIcon, Icon } from '@/components/ui/icon';

export default function ProtectedLayout() {
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
  useEffect(() => {
    // the protected route may still be rendering while going to singup, ignore if this is the case;
    // otherwise next will be signup.
    // TODO fix (jordan)
    if (!basicPlayerInfo && pathname !== '/signup') {
      router.replace({
        pathname: '/signup',
        params: {
          next: pathname
        }
      });
    }
  }, [basicPlayerInfo, pathname]);

  useEffect(() => {
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
          // router.replace('/invite');  // redirects to invite screen
          // return; // don’t fall through to <Slot />
          // notify user of new invite
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

  // if (!basicPlayerInfo) {
  //   return (
  //     <Redirect
  //       href={{
  //         pathname: '/signup',
  //         params: { next: pathname }
  //       }}
  //     />
  //   );
  // }

  if (!basicPlayerInfo) {
    // user is not authenticated, show blank page while we wait for the above effect to kick in
    return null;
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
      </Stack>
    </InvitesContext.Provider>
  );
}
