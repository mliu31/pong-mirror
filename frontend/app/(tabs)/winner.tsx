import React from 'react';
import { StyleSheet, Image, Platform, Button, View, TouchableHighlight, Touchable, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

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


export default function WinnerScreen(){

      return (
        <SafeAreaProvider>
          <View>
            <View style={styles.fixedButton}></View>
                <Button title="Back" onPress={() => navigation.navigate('inProgress')}></Button>
              <View
              style={{ flexDirection: 'column', justifyContent: 'space-between' }}
            >
          </View>
          // this has to:
            // change the screen
            // send an API request to call a server-side function that updates:
              // both winner's ELO
              // both loser's ELO 
          <TouchableHighlight onPress={() => navigation.navigate('')}> 

          <View style={[styles.playerViews, { backgroundColor: '#D2042D' }]}>
              <ThemedText>Ethan and Jordan</ThemedText>
          </View>

          </TouchableHighlight>  
            
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <ThemedText>Select Winner</ThemedText>
          </View>

          <TouchableHighlight onPress={() => navigation.navigate('')}>
            <View style={[styles.playerViews, { backgroundColor: '#0000FF' }]}>
              <ThemedText>Brian and Megan</ThemedText>
            </View>
          </TouchableHighlight>
            
          </View>
        </SafeAreaProvider>
      );
      
    
}