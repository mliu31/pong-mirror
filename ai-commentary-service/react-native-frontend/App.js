/**
 * Beer Pong Commentary App
 * Example App.js file showing how to integrate the BeerPongGame component
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import BeerPongGame from './components/BeerPongGame';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <BeerPongGame />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  }
});

export default App;
