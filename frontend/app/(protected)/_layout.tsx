import NotificationProvider from '@/components/NotificationProvider';
import { IoProvider } from '@/context/IoContext';
import { useAppSelector } from '@/redux/redux-hooks';
import { Redirect, Slot, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  // TODO: flesh out route protection
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);

  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    // the protected route may still be rendering while going to singup, ignore if this is the case;
    // otherwise next will be signup.
    if (!basicPlayerInfo && pathname !== '/signup') {
      console.log('going to signup, will return to', pathname);
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

  return <Slot></Slot>;
}
