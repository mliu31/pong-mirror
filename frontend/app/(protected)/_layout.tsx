import { Stack, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPlayerInvites } from '@/api/invite';
import { IInvite } from '@/api/types';
import InvitesContext from '@/context/InviteContext';
import useLoggedInPlayer from '@/hooks/useLoggedInPlayer';

export default function ProtectedLayout() {
  const pid = useLoggedInPlayer()._id;
  const [invites, setInvites] = useState<IInvite[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // If not logged in, stop checking so we hit the <Redirect>
    if (!pid) {
      return;
    }

    // Else, async check for invites
    const checkInvites = async () => {
      try {
        // fetch pending invites for this player
        const invites = (await getPlayerInvites(pid)).data;
        setInvites(invites);
      } catch (err) {
        console.error('Invite‐check failed', err);
      } finally {
        // setChecking(false);
      }
    };

    checkInvites();
    const intervalId = setInterval(checkInvites, 3000); // check every 3s

    return () => {
      clearInterval(intervalId); // cleanup
    };
  }, [pathname, pid]);

  // if (!pid) {
  //   return (
  //     <Redirect
  //       href={{
  //         pathname: '/signup',
  //         params: { next: pathname }
  //       }}
  //     />
  //   );
  // }

  if (!pid) {
    // user is not authenticated, show blank page while we wait for the above effect to kick in
    return null;
  }

  // no pending invites → render whatever protected screen they asked for
  return (
    <InvitesContext.Provider value={{ invites, setInvites }}>
      <Stack>
        {/* tab navigator, no header */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </InvitesContext.Provider>
  );
}
