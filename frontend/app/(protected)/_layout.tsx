import { useEffect, useState } from 'react';
import { IInvite } from '@/api/types';
import InvitesContext from '@/context/InviteContext';
import MessageProvider from '@/components/MessageProvider';
import { IoProvider } from '@/context/IoContext';
import { Stack, useGlobalSearchParams, usePathname, router } from 'expo-router';
import store, { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import api from '@/api';
import { logout } from '@/redux/slices/authSlice';

export default function ProtectedLayout() {
  useEffect(() => {
    // if we ever get a 401, clear auth state immediately
    // (navigation will handle redirecting to login)
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          store.dispatch(logout());
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  });
  const basicPlayerInfo = useSelector(
    (state: RootState) => state.auth.basicPlayerInfo
  );
  const [invites, setInvites] = useState<IInvite[]>([]);
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams();

  useEffect(() => {
    // the protected route may still be rendering while going to signup, ignore if this is the case;
    // otherwise next will be signup.
    if (basicPlayerInfo === null && pathname !== '/signup') {
      router.replace({
        pathname: '/signup',
        params: {
          next: pathname,
          nextParams: JSON.stringify(searchParams)
        }
      });
    }
  }, [pathname, searchParams, basicPlayerInfo]);

  if (!basicPlayerInfo) {
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
