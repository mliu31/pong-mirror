import { useGoogleAuth } from '@/hooks/useGoogleAuth';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Image } from 'react-native';
import { Text } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import BeerPongCupIcon from '@/components/PongCup';
import GoogleIcon from '@/assets/images/g-logo.png';

export default function SignUp() {
  const { promptAsync, request } = useGoogleAuth();

  const iconColor = useThemeColor(
    { light: '#277f5a', dark: '#d9d9d9' },
    'text'
  );

  return (
    <ThemedView className="flex-1 items-center justify-between px-6 py-10">
      {/* NEED1 logo */}
      <Box className="mt-20">
        <ThemedText
          style={{
            fontFamily: 'AlumniSansCollegiateOne_400Regular',
            fontSize: 150,
            letterSpacing: -2,
            textAlign: 'center'
          }}
        >
          NEE
          <Text style={{ color: '#277f5a' }}>D1</Text>
        </ThemedText>
      </Box>

      {/* pong cup icon */}
      <Box className="items-center">
        <BeerPongCupIcon size={100} color={iconColor} />
      </Box>

      {/* sign in button */}
      <Box
        className="w-full items-center space-y-4"
        style={{ marginTop: -40 }} // move it up by 40 pixels, adjust as needed
      >
        <Button
          action="secondary"
          variant="solid"
          size="lg"
          className="bg-gray-100 rounded-full flex-row items-center justify-center"
          onPress={() => promptAsync()}
          disabled={!request}
          style={{ paddingVertical: 40, paddingHorizontal: 40 }}
        >
          {/* Google icon */}
          <Image
            source={GoogleIcon}
            style={{ width: 40, height: 40, marginRight: 12 }} // bigger icon and spacing
            resizeMode="contain"
          />
          <ButtonText
            className="text-black font-semibold text-xl"
            style={{ flex: 1, textAlign: 'center' }}
          >
            Sign In
          </ButtonText>
        </Button>
      </Box>
    </ThemedView>
  );
}
