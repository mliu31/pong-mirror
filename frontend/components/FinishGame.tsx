import { router } from 'expo-router';
import { StyleSheet, Button, View, Dimensions } from 'react-native';

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

<View style={{ flexDirection: 'column', alignItems: 'center' }}>
  <Button title="Finish Game" onPress={() => router.push('./winner')}></Button>
</View>;
