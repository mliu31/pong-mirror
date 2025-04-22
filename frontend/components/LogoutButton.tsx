import { View, Button } from 'react-native';

import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { styles } from './auth/authstyles';

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  return (
    <View style={styles.buttonWrapper}>
      <Button title="Log out" onPress={handleLogout} />
    </View>
  );
}
