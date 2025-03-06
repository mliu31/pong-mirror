import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FriendBoxProps {
  rank: number;
  name: string;
  elo: number;
}

const styles = StyleSheet.create({
  macroView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: Dimensions.get('window').height / 25,
    color: '#000000'
  },
  rankAndName: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameView: {
    marginLeft: Dimensions.get('window').width / 15,
    fontSize: 24
  },
  rankView: {
    marginLeft: Dimensions.get('window').width / 20,
    fontSize: 24
  },
  eloView: {
    marginRight: Dimensions.get('window').width / 10,
    flex: 1,
    textAlign: 'right',
    fontSize: 24
  }
});

const FriendBox: React.FC<FriendBoxProps> = ({ rank, name, elo }) => {
  return (
    <View style={styles.macroView}>
      <View style={styles.rankAndName}>
        <ThemedText style={styles.rankView}>{rank}</ThemedText>
        <ThemedText style={styles.nameView}>{name}</ThemedText>
      </View>
      <ThemedText style={styles.eloView}>{elo}</ThemedText>
    </View>
  );
};

export default FriendBox;
