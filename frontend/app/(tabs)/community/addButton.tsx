import React from 'react';
import { StyleSheet, Button, View, TouchableHighlight } from 'react-native';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

interface AddButtonProps {
  category: string;
}

const styles = StyleSheet.create({
  buttonStyling: {
    alignSelf: 'flex-end',
    paddingLeft: Dimensions.get('window').height / 20,
    paddingRight: Dimensions.get('window').height / 20,
    width: 10,
    backgroundColor: 'blue'
  },
  titleStyling: {
    alignSelf: 'flex-start',
    paddingLeft: Dimensions.get('window').height / 20,
    paddingRight: Dimensions.get('window').height / 20
  }
});

const AddButton: React.FC<AddButtonProps> = ({ category }) => {
  const router = useRouter();
  if (category === 'Friends') {
    return (
      <View>
        <ThemedText style={styles.titleStyling}>Friends</ThemedText>
        <TouchableHighlight
          style={styles.buttonStyling}
          onPress={() => router.push('./addFriends')}
        >
          <ThemedText>+</ThemedText>
        </TouchableHighlight>
      </View>
    );
  } else if (category === 'Groups') {
    return (
      <span>
        <ThemedText style={styles.titleStyling}>Groups</ThemedText>
        <Button
          style={styles.buttonStyling}
          title="+"
          onPress={() => router.push('./addGroup')}
        ></Button>
      </span>
    );
  }
};

export default AddButton;
