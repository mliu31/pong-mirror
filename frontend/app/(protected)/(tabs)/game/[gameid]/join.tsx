import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Spinner } from '@/components/ui/spinner';

export default function Join() {
  return (
    <ThemedView>
      <Spinner></Spinner>
      <ThemedText>Joining game...</ThemedText>
    </ThemedView>
  );
}
