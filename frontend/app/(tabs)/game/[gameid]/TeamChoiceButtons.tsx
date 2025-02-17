import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

const TeamChoiceButtons = () => {
  const [team, setTeam] = useState<string | null>(null);

  const handleRedTeamPress = () => {
    // Handle red team selection
    setTeam('Red');
    console.log('Red team selected');
  };

  const handleBlueTeamPress = () => {
    // Handle blue team selection
    setTeam('Blue');
    console.log('Blue team selected');
  };

  return (
    <View style={styles.container}>
      <Button title="Red Team" onPress={handleRedTeamPress} color="red" />
      <Button title="Blue Team" onPress={handleBlueTeamPress} color="blue" />

      {team && <Text>Selected Team: {team}</Text>}
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
