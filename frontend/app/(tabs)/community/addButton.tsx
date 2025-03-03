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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import axios, { Axios } from 'axios';
interface AddButtonProps {
  category: string;
}

const styles = StyleSheet.create({
  buttonStyling: {
    alignItems: 'flex-end',
    paddingLeft: Dimensions.get('window').height / 20,
    paddingRight: Dimensions.get('window').height / 20
  }
});
