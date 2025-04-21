import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { TeamValue } from '@/constants/TEAM';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import { View } from 'react-native';
import { withSpring } from 'react-native-reanimated';
import { useState } from 'react';

const PlayerChip = ({
  pid,
  playerName,
  position,
  dragging,
  bounds,
  onSnapSide
}: {
  pid: string;
  playerName: string;
  position: { x: number; y: number };
  dragging: boolean;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  onSnapSide?: (pid: string, team: TeamValue) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [chipWidth, setChipWidth] = useState(0); // for dragging bounds; width is dynamic bc includes name label
  const CHIP_DIAM = 64; // px, from tailwind (w-16, h-16)w

  const translationX = useSharedValue(position.x);
  const translationY = useSharedValue(position.y);

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
  const panGesture = dragging
    ? Gesture.Pan()
        .onStart(() => {
          // set previous location
          prevTranslationX.value = translationX.value;
          prevTranslationY.value = translationY.value;
          setIsDragging(true);
        })
        .onUpdate((event) => {
          // limit movement to screen

          // screen bounds, 16px padding
          const BORDER_PADDING = 16;
          const minTranslate = BORDER_PADDING;
          const maxTranslateX = bounds.maxX - chipWidth - BORDER_PADDING;
          const maxTranslateY = bounds.maxY - CHIP_DIAM - 108; // padding above button

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
          if (translationX.value < bounds.maxX / 2 - chipWidth / 2) {
            translationX.value = withSpring(bounds.maxX * 0.25 - CHIP_DIAM / 2);
            translationY.value = withSpring(position.y);
            onSnapSide?.(pid, 'LEFT');
          } else {
            translationX.value = withSpring(bounds.maxX * 0.75 - CHIP_DIAM / 2);
            translationY.value = withSpring(position.y);
            onSnapSide?.(pid, 'RIGHT');
          }
        })
    : Gesture.Pan(); // Return a default gesture if dragging is false

  const initials = getInitials(playerName);
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          animatedStyles,
          { position: 'absolute', zIndex: isDragging ? 10 : 1 }
        ]}
      >
        {/* need width prop from View onLayout for x bounds; Box doesn't have this handler */}
        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setChipWidth(width);
          }}
        >
          <Box className="items-center relative">
            <Box className="w-16 h-16 rounded-full bg-primary-500  items-center justify-center">
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
