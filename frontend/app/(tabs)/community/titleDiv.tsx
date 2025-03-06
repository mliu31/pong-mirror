import { ThemedText } from '@/components/ThemedText';
import { View, Text, Dimensions } from 'react-native';

const styles = {
  titleStyling: {
    dislay: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: '24px',
    paddingTop: Dimensions.get('window').height / 25,
    paddingBottom: Dimensions.get('window').height / 25
  }
};

export default function TitleDiv() {
  return (
    <View style={styles.titleStyling}>
      <ThemedText style={styles.titleText}>Community</ThemedText>
    </View>
  );
}
