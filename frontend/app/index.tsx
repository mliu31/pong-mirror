import React from 'react';
import { StyleSheet, Image, Platform, Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import winnerScreen from './(tabs)/winner';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const NavStack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <View>
        <ThemedText>Ethan and Jordan</ThemedText>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button
          title="Finish Game"
          onPress={() => navigation.navigate('findWinner')}
        ></Button>
      </View>

      <ThemedText>Brian and Megan</ThemedText>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute'
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8
  }
});
