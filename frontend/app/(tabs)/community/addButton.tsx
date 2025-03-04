import React from 'react';
import { StyleSheet, Button, View, TouchableHighlight } from 'react-native';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import FriendBox from './friendBox';

interface AddButtonProps {
  category: string;
}

const styles = StyleSheet.create({
  buttonStyling: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Dimensions.get('window').width / 10,
    marginLeft: Dimensions.get('window').width / 10,
    width: Dimensions.get('window').width / 20,
    height: Dimensions.get('window').height / 20,
    backgroundColor: 'blue',
    borderRadius: 5
  },
  titleStyling: {
    alignSelf: 'flex-start',
    fontSize: 20,
    paddingLeft: Dimensions.get('window').height / 20,
    paddingRight: Dimensions.get('window').height / 20,
    flex: 1,
    textAlign: 'left'
  },
  viewStyling: {
    marginTop: Dimensions.get('window').height / 20,
    flexDirection: 'row'
  }
});

const AddButton: React.FC<AddButtonProps> = ({ category }) => {
  const router = useRouter();
  if (category === 'Friends') {
    return (
      <>
        <View style={styles.viewStyling}>
          <ThemedText style={styles.titleStyling}>Friends</ThemedText>
          <TouchableHighlight
            style={styles.buttonStyling}
            onPress={() => router.push('./addFriends')}
          >
            <ThemedText>+</ThemedText>
          </TouchableHighlight>
        </View>
        <View></View>
      </>
    );
  } else if (category === 'Groups') {
    return (
      <View style={styles.viewStyling}>
        <ThemedText style={styles.titleStyling}>Groups</ThemedText>
        <TouchableHighlight
          style={styles.buttonStyling}
          onPress={() => router.push('./addGroup')}
        >
          <ThemedText>+</ThemedText>
        </TouchableHighlight>
      </View>
    );
  }
};

export default AddButton;
