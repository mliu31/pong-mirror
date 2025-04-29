import { Spinner } from '@/components/ui/spinner';
import { Text, View } from 'react-native';

const JoinSpecificGame = () => {
  console.log('rerendering join game');
  return (
    <View className="flex-1 justify-center items-center gap-4">
      <Text className="text-lg font-semibold">Joining game…</Text>
      <Spinner size="large" />
    </View>
  );
};

export default JoinSpecificGame;
