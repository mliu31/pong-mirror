import { View, Text } from 'react-native';
import { Box } from './ui/box';

const TeamBoxes = ({
  setTeamBoxHeight
}: {
  setTeamBoxHeight: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
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
      <Box className="w-1/2 bg-success-300 p-10 top-0 left-0">
        <Text className="text-typography-950 text-left">Team 1</Text>
      </Box>

      <Box className="w-1/2 bg-secondary-50 p-10 top-0 right-0">
        <Text className="text-typography-950 text-right">Team 2</Text>
      </Box>
    </Box>
  );
};

export default TeamBoxes;
