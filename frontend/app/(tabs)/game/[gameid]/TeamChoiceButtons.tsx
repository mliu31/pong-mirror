import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

const TeamChoiceButtons = (props: { pid: string; gameid: string }) => {
  const pid = props.pid;
  const gameid = props.gameid;

  const [team, setTeam] = useState<string | string[] | null>(null);

  const handleButtonPress = (buttonType: string) => {
    // Handle team selection
    setTeam(buttonType);
    console.log(`${buttonType} team selected for user ${pid}`);

    // call api to update player/pid/team in backend
    // e.g. api.put(`/players/${pid}/team`, { team: buttonType });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Red Team"
        onPress={() => handleButtonPress('RED')}
        color={team === 'RED' ? 'red' : 'gray'}
      />
      <Button
        title="Blue Team"
        onPress={() => handleButtonPress('BLUE')}
        color={team === 'BLUE' ? 'blue' : 'gray'}
      />

      {team && (
        <Text>
          Selected Team: {Array.isArray(team) ? team.join(', ') : team}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default TeamChoiceButtons;
