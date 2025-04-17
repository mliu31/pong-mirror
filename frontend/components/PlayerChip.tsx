import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { TeamValue } from '@/constants/TEAM';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { withSpring } from 'react-native-reanimated';

const PlayerChip = ({
  pid,
  playerName,
  team,
  teamBoxHeight,
  order,
  totalChips,
  onSnapSide
}: {
  pid: string;
  playerName: string;
  team: TeamValue;
  teamBoxHeight: number;
  order: number;
  totalChips: number;
  onSnapSide: (pid: string, side: 'left' | 'right') => void;
}) => {
  const { width } = Dimensions.get('screen');
  const CHIP_SIZE = 64; // px, from tailwind (w-16, h-16)
  const CHIP_HEIGHT = CHIP_SIZE + 8; // px, from tailwind (mb-2)

  // const onLeft = useSharedValue(true);

  // initial position
  const initial_positionX = Math.floor(width / 2) - 32; // 32px offset bc of 64px chip radius
  const initial_positionY = Math.floor(
    teamBoxHeight / 2 - (CHIP_HEIGHT * totalChips) / 2
  );

  // current position
  const translationX = useSharedValue(initial_positionX);
  const translationY = useSharedValue(initial_positionY);

  // previous position
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  // animate chip based on gesture
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value }
    ]
  }));

  // used to prevent chips from going off screen
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

      // logging -- todo delete
      // if (event.translationX < 0) {
      //   onLeft.value = true;
      //   console.log('left');
      // } else {
      //   onLeft.value = false;
      //   console.log('right');
      // }

      // define screen bounds TODO
      const minTranslate = 0;
      const maxTranslateX = width - CHIP_SIZE;
      const maxTranslateY = teamBoxHeight - CHIP_SIZE;

      // console.log('x, y bounds for ', playerName, maxTranslateX, maxTranslateY);

      // enforce screen bounds
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

      // console.log('update loc: ', event.translationX, event.translationY);
    })
    .onEnd((event) => {
      // Determine L/R side, animate to snap

      // const initial_positionY =
      //   Math.floor(teamBoxHeight / 2) -
      //   (CHIP_HEIGHT * totalChips) / 2 +
      //   CHIP_HEIGHT * order;

      // center of each vertical half of screen
      const leftX = width * 0.25 - CHIP_SIZE / 2;
      const rightX = width * 0.75 - CHIP_SIZE / 2;

      if (translationX.value < width / 2) {
        translationX.value = withSpring(leftX);
      } else {
        translationX.value = withSpring(rightX);
      }

      // translationY.value = withSpring(teamBoxHeight / 2 - CHIP_SIZE / 2);
    });

  const initials = getInitials(playerName);
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyles]}>
        <Box className="w-16 h-16 rounded-full bg-primary-500 items-center justify-center mb-2">
          <Text className="text-secondary-0 font-bold text-2xl">
            {initials}
          </Text>
        </Box>
      </Animated.View>
    </GestureDetector>
  );
};

export default PlayerChip;
