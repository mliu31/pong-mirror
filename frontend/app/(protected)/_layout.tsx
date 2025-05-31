import { useEffect, useState } from 'react';
import { getPlayerInvites } from '@/api/invite';
import { IInvite } from '@/api/types';
import InvitesContext from '@/context/InviteContext';
import { useLoggedInPlayerUnsafe } from '@/hooks/useLoggedInPlayer';
import MessageProvider from '@/components/MessageProvider';
import { IoProvider } from '@/context/IoContext';
import { Stack, useGlobalSearchParams, usePathname, router } from 'expo-router';

export default function ProtectedLayout() {
  const pid = useLoggedInPlayerUnsafe()?._id;
  const [invites, setInvites] = useState<IInvite[]>([]);
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams();

  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      // can't use router.replace in the first render - wait until something is on the page
      setIsFirstRender(false);
      return;
    }
    // the protected route may still be rendering while going to signup, ignore if this is the case;
    // otherwise next will be signup.
    if (pid === undefined && pathname !== '/signup') {
      router.replace({
        pathname: '/signup',
        params: {
          next: pathname,
          nextParams: JSON.stringify(searchParams)
        }
      });
    }
  }, [pid, pathname, searchParams, isFirstRender]);

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

  if (!pid) {
    // user is not authenticated, show blank page while we wait for the above effect to kick in
    return null;
  }

  // no pending invites → render whatever protected screen they asked for
  return (
    <IoProvider>
      <MessageProvider>
        <InvitesContext.Provider value={{ invites, setInvites }}>
          <Stack>
            {/* tab navigator, no header */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </InvitesContext.Provider>
      </MessageProvider>
    </IoProvider>
  );
}
