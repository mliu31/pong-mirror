import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MyButton = () => {
  const [buttonState, setButtonState] = useState(false);

  const handlePress = () => {
    setButtonState(!buttonState);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonState ? styles.buttonActive : styles.buttonInactive
        ]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>
          {buttonState ? 'Active' : 'Inactive'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.statusText}>
        Status: {buttonState ? 'Active' : 'Inactive'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 20
  },
  buttonInactive: {
    backgroundColor: 'gray'
  },
  buttonActive: {
    backgroundColor: 'green'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  statusText: {
    fontSize: 18
  }
});

export default MyButton;
