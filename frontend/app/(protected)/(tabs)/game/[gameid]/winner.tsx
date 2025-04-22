import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { BackButton } from '../../../../../components/BackButton';
import ClickWinner from './clickWinner';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import TeamChips from '@/components/TeamChips';
import TeamBoxes from '@/components/TeamBoxes';
import { useState } from 'react';
import { Player } from '@/api/types';
import { Dimensions, Pressable } from 'react-native';
import { TeamValue } from '@/constants/TEAM';

export default function WinnerScreen() {
  const { gameid, leftTeam, rightTeam } = useLocalSearchParams<{
    gameid: string;
    leftTeam: string;
    rightTeam: string;
  }>();
  const [teamBoxHeight, setTeamBoxHeight] = useState(0); // used to center chips vertically
  const { width } = Dimensions.get('screen');
  const [winner, setWinner] = useState<TeamValue>();

  const handleConfirm = () => {
    console.log(winner, gameid);
  };

  const handlePress = (event: { nativeEvent: { locationX: number } }) => {
    const x = event.nativeEvent.locationX;

    if (x < width / 2) {
      console.log('left winner');
      setWinner('LEFT');
    } else {
      console.log('right winner');
      setWinner('RIGHT');
    }
  };

  return (
    <ThemedView className="flex-1 relative">
      <Pressable
        style={{ flex: 1 }}
        onPressIn={handlePress} // press start gives you coords
      >
        <TeamBoxes setTeamBoxHeight={setTeamBoxHeight} />
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-4 mb-auto z-10">
          <ThemedText className="text-center text-typography-950 text-xl">
            vs
          </ThemedText>
        </Box>

        {/* chips and continue button */}
        <Box className="absolute w-full h-full top-0 left-0">
          <TeamChips
            leftTeam={JSON.parse(leftTeam) as Player[]}
            rightTeam={JSON.parse(rightTeam) as Player[]}
            teamBoxHeight={teamBoxHeight}
          />

          <Box className="justify-center px-4 pb-4 mt-auto">
            <ThemedText className="text-center text-typography-950 text-lg mb-2">
              Tap the winning team
            </ThemedText>

            <Button
              action="primary"
              variant="solid"
              size="md"
              onPress={() => handleConfirm()}
            >
              <ButtonText>Confirm</ButtonText>
            </Button>
          </Box>
        </Box>
      </Pressable>
    </ThemedView>

    // <SafeAreaProvider>
    //   <View>
    //     <BackButton></BackButton>
    //     <View
    //       style={{ flexDirection: 'column', justifyContent: 'space-between' }}
    //     ></View>
    //     <ClickWinner teamColor="RED" gameid={gameid} />
    //     <View style={{ flexDirection: 'column', alignItems: 'center' }}>
    //       <ThemedText>Select Winner</ThemedText>
    //     </View>
    //     <ClickWinner teamColor="BLUE" gameid={gameid} />
    //   </View>
    // </SafeAreaProvider>
  );
}
