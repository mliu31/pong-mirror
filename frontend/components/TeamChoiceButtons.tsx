import { updatePlayerTeam } from '@/api/games';
import TEAM from '@/constants/TEAM';
import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

const TeamChoiceButtons = (props: { pid: string; gameid: string }) => {
  const pid = props.pid;
  const gameid = props.gameid;

  const [team, setTeam] = useState<string | null>(null);

  const handleButtonPress = (buttonType: string) => {
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

      {team && <Text>Selected Team: {team}</Text>}
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
