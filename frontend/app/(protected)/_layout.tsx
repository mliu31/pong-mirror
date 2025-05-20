import MessageProvider from '@/components/MessageProvider';
import { IoProvider } from '@/context/IoContext';
import { useAppSelector } from '@/redux/redux-hooks';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  // TODO: flesh out route protection
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);

  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    // the protected route may still be rendering while going to singup, ignore if this is the case;
    // otherwise next will be signup.
    if (basicPlayerInfo === null && pathname !== '/signup') {
      router.push({
        pathname: '/signup',
        params: {
          next: pathname
        }
      });
    }
  }, [basicPlayerInfo, pathname, router]);

  if (!basicPlayerInfo) {
    // user is not authenticated, show blank page while we wait for the above effect to kick in
    return null;
  }

  return (
    <IoProvider>
      <MessageProvider>
        <Slot></Slot>
      </MessageProvider>
    </IoProvider>
  );
}
