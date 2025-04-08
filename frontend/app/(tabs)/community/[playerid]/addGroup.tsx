import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  searchView: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  searchBox: {
    color: '#808080',
    width: Dimensions.get('window') / 10
  }
});

export function AddGroupPage() {
  return (
    <SafeAreaView>
      <View></View>
    </SafeAreaView>
  );
}
