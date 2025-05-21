import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

const useLoggedInPlayer = () => {
  const basicPlayerInfo = useSelector(
    (state: RootState) => state.auth.basicPlayerInfo
  );
  if (basicPlayerInfo === null || basicPlayerInfo === undefined) {
    throw new Error(
      'useLoggedInPlayer must not be called until the player is logged in'
    );
  }
  return basicPlayerInfo;
};

export default useLoggedInPlayer;
