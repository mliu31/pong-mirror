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
import { useRouter } from 'expo-router';
import axios, { Axios } from 'axios';

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
  const router = useRouter();

  // const clickWinner = async (teamColor: String, gameId: Number) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/games/id', {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     return response.data.gameId;
  //   } catch {
  //     console.error(
  //       'Error fetching game ID:',
  //       Error.response.data || Error.message
  //     );
  //   }
  // };

  return (
    <SafeAreaProvider>
      <View>
        <View style={styles.fixedButton}></View>
        <Button title="Back" onPress={() => router.back()}></Button>
        <View
          style={{ flexDirection: 'column', justifyContent: 'space-between' }}
        ></View>
        <TouchableHighlight onPress={() => router.navigate('')}>
          <View style={[styles.playerViews, { backgroundColor: '#D2042D' }]}>
            <ThemedText>Red Team</ThemedText>
          </View>
        </TouchableHighlight>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <ThemedText>Select Winner</ThemedText>
        </View>

        <TouchableHighlight onPress={() => router.push('')}>
          <View style={[styles.playerViews, { backgroundColor: '#0000FF' }]}>
            <ThemedText>Blue Team</ThemedText>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaProvider>
  );
}
