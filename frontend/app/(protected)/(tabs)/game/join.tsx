import { Button } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import InviteList from '@/components/InviteList';

export default function GameLandingScreen() {
  return (
    <ThemedView className="flex-1 relative">
      <InviteList />
      <Button
        className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center shadow-md absolute bottom-4 right-4"
        onPress={() => {
          router.push('/game/scanjoin');
        }}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={54} color="black" />
      </Button>
    </ThemedView>
  );
}
