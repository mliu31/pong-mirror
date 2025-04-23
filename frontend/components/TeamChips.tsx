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

  const renderTeam = (team: Player[], isLeft: boolean) => {
    return (
      <Box
      // TODO WORKING ON BORDER
      // className="absolute border border-gray-300 rounded-xl"
      // style={{
      //   left: teamX - 12, // shift box so it wraps the chip's center
      //   top: teamBoxHeight / 2 - (CHIP_HEIGHT * team.length) / 2 - 12, // add padding above
      //   width: CHIP_DIAM + 24,
      //   height: CHIP_HEIGHT * team.length + 24,
      //   padding: 6,
      //   alignItems: 'center',
      //   justifyContent: 'center'
      // }}
      >
        {team.map((player, index) => (
          <PlayerChip
            key={player._id}
            pid={player._id}
            playerName={player.name}
            position={{
              x: isLeft ? leftX : rightX,
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
      {teamBoxHeight > 0 && renderTeam(leftTeam, true)}
      {teamBoxHeight > 0 && renderTeam(rightTeam, false)}
    </Box>
  );
};

export default TeamChips;
