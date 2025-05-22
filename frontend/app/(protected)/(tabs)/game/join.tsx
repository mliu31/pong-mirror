import { Button } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import InviteList from '@/components/InviteList';
import { Box } from '@/components/ui/box';

export default function GameLandingScreen() {
  return (
    <Box className="flex-1">
      <ThemedView className="flex-1">
        <InviteList />
        <Button
          className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center"
          onPress={() => {
            router.push('/game/scanjoin');
          }}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={54} color="black" />
        </Button>
      </ThemedView>
    </Box>
  );
}
