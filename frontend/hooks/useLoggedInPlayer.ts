import { IPlayer } from '@/api/types';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

function useLoggedInPlayerBase(throws: true): IPlayer;
function useLoggedInPlayerBase(throws: false): IPlayer | null;
function useLoggedInPlayerBase(throws: boolean) {
  const basicPlayerInfo = useSelector(
    (state: RootState) => state.auth.basicPlayerInfo
  );
  if (!basicPlayerInfo) {
    if (throws) {
      throw new Error('useLoggedInPlayer must not be called until logged in');
    }
    return null;
  }
  return basicPlayerInfo;
}

const useLoggedInPlayer = () => useLoggedInPlayerBase(true);
export default useLoggedInPlayer;
export const useLoggedInPlayerUnsafe = () => useLoggedInPlayerBase(false);
