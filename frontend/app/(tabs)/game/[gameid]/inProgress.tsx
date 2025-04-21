import { Dimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { Game } from '@/api/types';
import { useEffect, useState } from 'react';
import { getGame } from '@/api/games';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import PlayerChip from '@/components/PlayerChip';
import { Player } from '@/api/types';
import { ThemedView } from '@/components/ThemedView';

export default function InProgress() {
  const local = useLocalSearchParams();
  const [leftTeam, setLeftTeam] = useState<Player[]>([]);
  const [rightTeam, setRightTeam] = useState<Player[]>([]);
  const [teamBoxHeight, setTeamBoxHeight] = useState(0); // used to center chips vertically

  // sort players into left/right teams
  useEffect(() => {
    getGame(local.gameid as string).then((res) => {
      const game = res.data as Game;
      setLeftTeam(
        game.players.filter((p) => p.team === 'LEFT').map((p) => p.player)
      );
      setRightTeam(
        game.players.filter((p) => p.team === 'RIGHT').map((p) => p.player)
      );
    });
  }, [local.gameid]);

  const { width } = Dimensions.get('screen');
  const chipHeightOffset = 16; // px, padding below chip
  const CHIP_DIAM = 64; // px, from tailwind (w-16, h-16)w
  const CHIP_HEIGHT = CHIP_DIAM + chipHeightOffset; // px

  // left and right team positions
  const leftX = width * 0.25 - CHIP_DIAM / 2;
  const rightX = width * 0.75 - CHIP_DIAM / 2;

  return (
    <ThemedView className="flex-1 relative">
      <Box className="flex-row h-full">
        {/* need height prop from View onLayout to center chips vertically; Box doesn't have this handler */}
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setTeamBoxHeight(height);
          }}
          style={{
            flex: 1
          }}
        ></View>

        {/* L/R team boxes */}
        <Box className="w-1/2 bg-success-300 p-10 top-0 left-0 "></Box>
        <Box className="w-1/2 bg-secondary-50 p-10 top-0 right-0"></Box>
      </Box>
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-4 mb-auto z-10">
        <ThemedText className="text-center text-typography-950 text-lg mb-2">
          vs
        </ThemedText>
      </Box>
      <Box className="absolute w-full h-full top-0 left-0">
        {teamBoxHeight > 0 &&
          leftTeam &&
          leftTeam.map((player, index) => (
            <PlayerChip
              key={player._id}
              pid={player._id}
              playerName={player.name}
              position={{
                x: leftX,
                y:
                  teamBoxHeight / 2 -
                  (CHIP_HEIGHT * leftTeam.length) / 2 +
                  CHIP_HEIGHT * index
              }}
              dragging={false}
              bounds={{
                minX: 0,
                maxX: width,
                minY: 0,
                maxY: teamBoxHeight
              }}
            />
          ))}
        {teamBoxHeight > 0 &&
          rightTeam &&
          rightTeam.map((player, index) => (
            <PlayerChip
              key={player._id}
              pid={player._id}
              playerName={player.name}
              position={{
                x: rightX,
                y:
                  teamBoxHeight / 2 -
                  (CHIP_HEIGHT * rightTeam.length) / 2 +
                  CHIP_HEIGHT * index
              }}
              dragging={false}
              bounds={{
                minX: 0,
                maxX: width,
                minY: 0,
                maxY: teamBoxHeight
              }}
            />
          ))}

        <Box className="justify-center px-4 pb-4 mt-auto">
          <ThemedText className="text-center text-typography-950 text-lg mb-2">
            May the best team win...
          </ThemedText>

          <Button
            onPress={() => router.push('./winner')}
            action="primary"
            variant="solid"
            size="md"
          >
            <ButtonText>End Game</ButtonText>
          </Button>
        </Box>
      </Box>
    </ThemedView>
  );
}
