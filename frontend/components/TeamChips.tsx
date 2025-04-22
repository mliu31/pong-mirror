import { Dimensions } from 'react-native';
import { Box } from './ui/box';
import PlayerChip from './PlayerChip';
import { Player } from '@/api/types';
import { CHIP_DIAM, CHIP_HEIGHT } from '@/constants/CHIP';

const TeamChips = ({
  leftTeam,
  rightTeam,
  teamBoxHeight
}: {
  leftTeam: Player[];
  rightTeam: Player[];
  teamBoxHeight: number;
}) => {
  const { width } = Dimensions.get('screen');

  // left and right team positions
  const leftX = width * 0.25 - CHIP_DIAM / 2;
  const rightX = width * 0.75 - CHIP_DIAM / 2;
  return (
    <Box>
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
  );
};

export default TeamChips;
