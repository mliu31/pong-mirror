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
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import axios, { Axios } from 'axios';

interface ClickWinnerProps {
  teamColor: string;
  gameid: string;
}

const styles = StyleSheet.create({
  playerViews: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: Dimensions.get('window').height / 10,
    paddingTop: Dimensions.get('window').height / 10
  }
});

const ClickWinner: React.FC<ClickWinnerProps> = ({ teamColor, gameid }) => {
  const router = useRouter();
  let bColor: string;
  if (teamColor === 'RED') {
    bColor = '#D2042D';
  } else {
    bColor = '#0000FF';
  }
  const sendWinner = async (teamColor: string, gameid: string) => {
    try {
      const response = await axios.patch(
        'http://localhost:3000/games/' + gameid + '/winningColor/' + teamColor
      );
      router.navigate(['../leaderboard/leaderboard-core']);
      console.log(response);
    } catch (error) {
      console.error('Error fetching game ID:', error);
    }
  };

  return (
    <TouchableHighlight onPress={() => sendWinner(teamColor, gameid)}>
      <View style={[styles.playerViews, { backgroundColor: bColor }]}>
        <ThemedText>{`${teamColor} Team`}</ThemedText>
      </View>
    </TouchableHighlight>
  );
};

export default ClickWinner;
