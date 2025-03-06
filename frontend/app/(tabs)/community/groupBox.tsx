import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface GroupBoxProps {
  groupName: string;
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

const GroupBox: React.FC<GroupBoxProps> = ({ groupName }) => {
  return (
    <View style={styles.macroView}>
      <View style={styles.rankAndName}>
        <ThemedText style={styles.rankView}>{groupName}</ThemedText>
      </View>
    </View>
  );
};

export default GroupBox;
