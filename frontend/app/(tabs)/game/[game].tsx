import { Text, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams } from 'expo-router';

export default function Route() {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  console.log('Local:', local.user, 'Global:', glob.user);

  return (
    <View>
      <Text>User: {local.user}</Text>
    </View>
  );
}
