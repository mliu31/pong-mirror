import { Dimensions } from 'react-native';
import { Box } from './ui/box';
import PlayerChip from './PlayerChip';
import { Player } from '@/api/types';
import {
  CHIP_DIAM,
  CHIP_HEIGHT,
  PADDING,
  CHIP_HEIGHT_OFFSET
} from '@/constants/CHIP';

const TeamChips = ({
  leftTeam,
  rightTeam,
  teamBoxHeight,
  showLeftBorder,
  showRightBorder
}: {
  leftTeam: Player[];
  rightTeam: Player[];
  teamBoxHeight: number;
  showLeftBorder?: boolean;
  showRightBorder?: boolean;
}) => {
  const { width } = Dimensions.get('screen');

  // left and right team positions
  const leftX = width * 0.25 - CHIP_DIAM / 2;
  const rightX = width * 0.75 - CHIP_DIAM / 2;

  const renderTeam = (
    team: Player[],
    isLeft: boolean,
    showBorder?: boolean
  ) => {
    const teamX = isLeft ? leftX : rightX;
    return (
      <Box>
        <Box
          className={`absolute ${showBorder ? 'border' : ''} border-gray-300 rounded-xl`}
          style={{
            left: teamX - PADDING, // shift box so it wraps the chip's center
            top: teamBoxHeight / 2 - (CHIP_HEIGHT * team.length) / 2 - PADDING, // add padding above
            width: CHIP_DIAM + PADDING * 2,
            height:
              CHIP_HEIGHT * team.length + PADDING * 2 - CHIP_HEIGHT_OFFSET,
            padding: 6
          }}
        ></Box>
        {team.map((player, index) => (
          <PlayerChip
            key={player._id}
            pid={player._id}
            playerName={player.name}
            position={{
              x: teamX,
              y:
                teamBoxHeight / 2 -
                (CHIP_HEIGHT * team.length) / 2 +
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

  return (
    <Box className="absolute w-full h-full top-0 left-0">
      {teamBoxHeight > 0 && renderTeam(leftTeam, true, showLeftBorder)}
      {teamBoxHeight > 0 && renderTeam(rightTeam, false, showRightBorder)}
    </Box>
  );
};

export default TeamChips;
