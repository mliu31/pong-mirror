import React from 'react';
import { StyleSheet, Button, View, TouchableHighlight } from 'react-native';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

const styles = StyleSheet.create({
  macroView: {
    flexDirection: 'row'
  },
  rankAndName: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameView: {
    fontSize: 24,
    color: '#000000'
  }
});

export default function FriendBox() {
  return (
    <View style={styles.macroView}>
      <View style={styles.rankAndName}>
        <ThemedText style={styles.nameView}>Ethan</ThemedText>
      </View>
    </View>
  );
}
