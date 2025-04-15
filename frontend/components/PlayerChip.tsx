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
  team
}: {
  pid: string;
  playerName: string;
  team: TeamValue;
}) => {
  const { width, height } = Dimensions.get('screen');
  console.log(width, height);

  const onLeft = useSharedValue(true);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

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
    })
    .onUpdate((event) => {
      // limit movement to screen
      console.log('loc: ', event.translationX, event.translationY);

      if (event.translationX < 0) {
        onLeft.value = true;
        console.log('left');
      } else {
        onLeft.value = false;
        console.log('right');
      }

      const maxTranslateX = width / 2;
      const maxTranslateY = height / 2;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .onEnd((event) => {
      // Determine side, call onDrop, animate to snap
    });

  const initials = getInitials(playerName);
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyles]}>
        <Box className="w-20 h-20 rounded-full bg-primary-500 items-center justify-center">
          <Text className="text-secondary-0 font-bold text-3xl">
            {initials}
          </Text>
        </Box>
      </Animated.View>
    </GestureDetector>
  );
};

export default PlayerChip;
