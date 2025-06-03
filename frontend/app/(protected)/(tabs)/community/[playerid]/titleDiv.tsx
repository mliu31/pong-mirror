import { ThemedText } from '@/components/ThemedText';
import {
  View,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';

const styles = {
  titleStyling: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as StyleProp<ViewStyle>,
  titleText: {
    fontSize: 24,
    paddingTop: Dimensions.get('window').height / 25,
    paddingBottom: Dimensions.get('window').height / 25
  } as StyleProp<TextStyle>
};

export default function TitleDiv() {
  return (
    <View style={styles.titleStyling}>
      <ThemedText style={[styles.titleText, { color: '#000' }]}>
        {'\n    Community\n    '}
      </ThemedText>
    </View>
  );
}
