import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

interface AddButtonProps {
  category: string;
  playerId?: string;
  friendIds?: string[];
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
    fontSize: 25,
    paddingLeft: Dimensions.get('window').height / 20,
    paddingRight: Dimensions.get('window').height / 20,
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center'
  },
  viewStyling: {
    marginTop: Dimensions.get('window').height / 20,
    flexDirection: 'row'
  }
});

const AddButton: React.FC<AddButtonProps> = ({
  category,
  playerId,
  friendIds
}) => {
  const router = useRouter();

  const handleFriendsPress = () => {
    if (!playerId) {
      console.error('Player ID is missing');
      return;
    }

    router.push({
      pathname: '/profile/EditFriends',
      params: {
        friendIds: JSON.stringify(friendIds || []),
        pid: playerId
      }
    });
  };

  if (category === 'Friends') {
    return (
      <>
        <View style={styles.viewStyling}>
          <ThemedText style={styles.titleStyling}>Friends</ThemedText>
          <TouchableHighlight
            style={styles.buttonStyling}
            onPress={handleFriendsPress}
          >
            <ThemedText>Edit</ThemedText>
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
