import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { TeamValue } from '@/constants/TEAM';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const PlayerChip = ({
  pid,
  playerName,
  team,
  teamBoxHeight
}: {
  pid: string;
  playerName: string;
  team: TeamValue;
  teamBoxHeight: number;
}) => {
  const { width } = Dimensions.get('screen');
  const chipSize = 64; // px, from tailwind (w-16, h-16)
  console.log(width, teamBoxHeight, teamBoxHeight / 2 - chipSize / 2);

  const onLeft = useSharedValue(true);
  const translationX = useSharedValue(Math.floor(width / 2) - 32); // 32px offset bc of 64px chip radius
  const translationY = useSharedValue(
    Math.floor(teamBoxHeight / 2) - chipSize / 2
  );
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  console.log(translationX, translationY);

  // animate chip based on gesture
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value }
    ]
  }));

  // prevent chips from going off screen
  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  // turn name into initials
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  };

  // detects pan gesture (drag/drop)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // set previous location
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;

      console.log(translationX.value, translationY.value);
      console.log('start');
    })
    .onUpdate((event) => {
      // limit movement to screen
      // console.log('loc: ', event.translationX, event.translationY);

      if (event.translationX < 0) {
        onLeft.value = true;
        console.log('left');
      } else {
        onLeft.value = false;
        console.log('right');
      }

      const minTranslate = 0;
      const maxTranslateX = width - chipSize;
      const maxTranslateY = teamBoxHeight - chipSize;

      console.log(maxTranslateX, maxTranslateY);

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        minTranslate,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        minTranslate,
        maxTranslateY
      );

      console.log(translationX.value, translationY.value);
    })
    .onEnd((event) => {
      // Determine side, call onDrop, animate to snap
    });

  const initials = getInitials(playerName);
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyles]}>
        <Box className="w-16 h-16 rounded-full bg-primary-500 items-center justify-center">
          <Text className="text-secondary-0 font-bold text-2xl">
            {initials}
          </Text>
        </Box>
      </Animated.View>
    </GestureDetector>
  );
};

export default PlayerChip;
