import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, ButtonText } from '@/components/ui/button';

export default function TournamentWinnerScreen() {
  const { teamName } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ThemedView className="flex-1 p-5 items-center justify-center">
      <View className="items-center">
        <ThemedText type="title" className="mb-4 text-center">
          Tournament Complete!
        </ThemedText>
        <ThemedText className="text-2xl mb-8 text-center">
          🏆 {teamName} Wins! 🏆
        </ThemedText>
        <Button
          action="primary"
          variant="solid"
          size="lg"
          onPress={() => router.back()}
        >
          <ButtonText>Back to Tournament</ButtonText>
        </Button>
      </View>
    </ThemedView>
  );
}
