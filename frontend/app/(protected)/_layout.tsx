import { useAppSelector } from '@/redux/redux-hooks';
import { Redirect, router, Slot, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPlayerInvites } from '@/api/invite';

export default function ProtectedLayout() {
  // TODO: flesh out route protection
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);
  const pid = basicPlayerInfo?._id;
  const [checking, setChecking] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    // If not logged in, stop checking so we hit the <Redirect> OR already on the invite page, clear checking so <Slot> (Invite) renders
    if (!basicPlayerInfo || pathname === '/invite') {
      setChecking(false);
      return;
    }

    // Else, async check for invites
    const pid = basicPlayerInfo?._id;
    (async () => {
      try {
        // fetch pending invites for this player
        const invites = (await getPlayerInvites(pid)).data;
        if (invites.length > 0) {
          router.replace('/invite');
          return; // don’t fall through to <Slot />
        }
      } catch (err) {
        console.error('Invite‐check failed', err);
      } finally {
        setChecking(false);
      }
    })();
  }, [basicPlayerInfo, pathname, pid]);

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

  // show nothing (or a loader) while we’re deciding
  if (checking) {
    return null;
  }

  // no pending invites → render whatever protected screen they asked for
  return <Slot></Slot>;
}
