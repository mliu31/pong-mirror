import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { TeamValue } from '@/constants/TEAM';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import { Dimensions, View } from 'react-native';
import { withSpring } from 'react-native-reanimated';
import { useState } from 'react';

const PlayerChip = ({
  pid,
  playerName,
  teamBoxHeight,
  order,
  totalChips,
  onSnapSide
}: {
  pid: string;
  playerName: string;
  teamBoxHeight: number;
  order: number;
  totalChips: number;
  onSnapSide: (pid: string, team: TeamValue) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [chipWidth, setChipWidth] = useState(0); // for dragging bounds; width is dynamic bc includes name label

  // dimension constants
  const { width } = Dimensions.get('screen');
  const chipHeightOffset = 16; // px, padding below chip
  const CHIP_DIAM = 64; // px, from tailwind (w-16, h-16)w
  const CHIP_HEIGHT = CHIP_DIAM + chipHeightOffset; // px

  // initial position
  const initial_positionX = Math.floor(width / 2 - CHIP_DIAM / 2);
  const initial_positionY = Math.floor(
    teamBoxHeight / 2 - (CHIP_HEIGHT * totalChips) / 2 + CHIP_HEIGHT * order
  );

  // current position
  const translationX = useSharedValue(initial_positionX);
  const translationY = useSharedValue(initial_positionY);

  // previous position
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  // cap x,y coords to enforce drag bounds
  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  // animate chip based on gesture
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value }
    ]
  }));

  // turn name into initials
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  };

  // detect pan gesture (drag/drop)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // set previous location
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
      setIsDragging(true);
      setIsDragging(true);
    })
    .onUpdate((event) => {
      // limit movement to screen

      // screen bounds, 16px padding
      const BORDER_PADDING = 16;
      const minTranslate = BORDER_PADDING;
      const maxTranslateX = width - chipWidth - BORDER_PADDING;
      const maxTranslateY = teamBoxHeight - CHIP_DIAM - 96; // padding above button

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
    })
    .onEnd((event) => {
      // Determine L/R side, animate to snap

      setIsDragging(false);
      // center of each vertical half of screen
      const leftX = width * 0.25 - CHIP_DIAM / 2;
      const rightX = width * 0.75 - CHIP_DIAM / 2;

      if (translationX.value < width / 2 - chipWidth / 2) {
        translationX.value = withSpring(leftX);
        translationY.value = withSpring(initial_positionY);
        onSnapSide(pid, 'LEFT');
      } else {
        translationX.value = withSpring(rightX);
        translationY.value = withSpring(initial_positionY);
        onSnapSide(pid, 'RIGHT');
      }
    });

  const initials = getInitials(playerName);
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          animatedStyles,
          { position: 'absolute', zIndex: isDragging ? 10 : 1 }
        ]}
      >
        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setChipWidth(width);
          }}
        >
          <Box className="items-center relative">
            <Box className="w-16 h-16 rounded-full bg-primary-500 items-center justify-center">
              <Text className="text-secondary-0 font-bold text-2xl">
                {initials}
              </Text>
            </Box>
            {isDragging && (
              <Box>
                <Text className="text-center">{playerName}</Text>
              </Box>
            )}
          </Box>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default PlayerChip;
