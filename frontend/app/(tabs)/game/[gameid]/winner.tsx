import React from 'react';
import {
  StyleSheet,
  Image,
  Platform,
  Button,
  View,
  TouchableHighlight,
  Touchable
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios, { Axios } from 'axios';
import { BackButton } from '../../../../components/BackButton';
import ClickWinner from './clickWinner';

const styles = StyleSheet.create({
  playerViews: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: Dimensions.get('window').height / 10,
    paddingTop: Dimensions.get('window').height / 10
  },

  fixedButton: {
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0
  }
});

export default function WinnerScreen() {
  const { thisGameId } = useLocalSearchParams<{ gameid: string }>();

  return (
    <SafeAreaProvider>
      <View>
        <BackButton></BackButton>
        <View
          style={{ flexDirection: 'column', justifyContent: 'space-between' }}
        ></View>
        <ClickWinner teamColor="RED" gameid={thisGameId} />
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <ThemedText>Select Winner</ThemedText>
        </View>
        <ClickWinner teamColor="BLUE" gameid={thisGameId} />
      </View>
    </SafeAreaProvider>
  );
}
