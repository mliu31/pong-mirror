import { router } from 'expo-router';
import { StyleSheet, Button, View } from 'react-native';

const styles = StyleSheet.create({
  fixedButton: {
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0
  }
});

export default function BackButton() {
  return (
    <>
      <View style={styles.fixedButton}></View>
      <Button title="Back" onPress={() => router.back()}></Button>
      <View />
    </>
  );
}
