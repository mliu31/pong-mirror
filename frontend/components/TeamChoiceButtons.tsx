import { updatePlayerTeam } from '@/api/games';
import TEAM, { TeamValue } from '@/constants/TEAM';
import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

const TeamChoiceButtons = ({
  pid,
  gameid,
  initialValue = TEAM.UNASSIGNED
}: {
  pid: string;
  gameid: string;
  initialValue?: TeamValue;
}) => {
  const [team, setTeam] = useState<TeamValue>(initialValue);

  const handleButtonPress = (buttonType: TeamValue) => {
    // Handle team selection
    setTeam(buttonType);
    updatePlayerTeam(pid, buttonType, gameid);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Red Team"
        onPress={() => handleButtonPress(TEAM.RED)}
        color={team === TEAM.RED ? 'red' : 'gray'}
      />
      <Button
        title="Blue Team"
        onPress={() => handleButtonPress(TEAM.BLUE)}
        color={team === TEAM.BLUE ? 'blue' : 'gray'}
      />

      {/* {team && <Text>{team}</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default TeamChoiceButtons;
