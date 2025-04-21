import { Dimensions, View } from 'react-native';
import { Box } from './ui/box';
import { ThemedText } from './ThemedText';
import PlayerChip from './PlayerChip';
import { useState } from 'react';
import { Player } from '@/api/types';
import { CHIP_DIAM, CHIP_HEIGHT } from '@/constants/CHIP';

const TeamChips = ({
  leftTeam,
  rightTeam
}: {
  leftTeam: Player[];
  rightTeam: Player[];
}) => {
  const [teamBoxHeight, setTeamBoxHeight] = useState(0); // used to center chips vertically

  const { width } = Dimensions.get('screen');

  // left and right team positions
  const leftX = width * 0.25 - CHIP_DIAM / 2;
  const rightX = width * 0.75 - CHIP_DIAM / 2;
  return (
    <Box>
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
      </Box>
    </Box>
  );
};

export default TeamChips;
