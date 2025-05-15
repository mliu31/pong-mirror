import { useAppSelector } from '@/redux/redux-hooks';
import { Redirect, Slot, usePathname } from 'expo-router';

export default function ProtectedLayout() {
  // TODO: flesh out route protection
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);

  const pathname = usePathname();

  if (!basicPlayerInfo) {
    return (
      <Redirect
        href={{
          pathname: '/signup',
          params: {
            next: pathname
          }
        }}
      />
    );
  }

  return <Slot></Slot>;
}
