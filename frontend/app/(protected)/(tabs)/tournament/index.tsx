import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppSelector } from '@/redux/redux-hooks';
import { createTournament, addTeam, getTournament } from '@/api/tournament';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { HStack } from '@gluestack-ui/themed';
import { Toast, useToast } from '@/components/ui/toast';
import { TextInput } from 'react-native';

export default function TournamentScreen() {
  const router = useRouter();
  const toast = useToast();
  const [manualTournamentId, setManualTournamentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);
  console.log('basicPlayerInfo');
  console.log(basicPlayerInfo);

  const handleCreateTournament = async () => {
    if (!tournamentName.trim()) {
      alert('Please enter a tournament name');
      return;
    }
    try {
      const tournament = await createTournament(
        tournamentName.trim(),
        basicPlayerInfo?._id || ''
      );
      router.push(`/tournament/${tournament._id}`);
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament. Please try again.');
    }
  };

  const handleManualJoin = async () => {
    const trimmedId = manualTournamentId.trim();
    if (!trimmedId) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'join-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>Please enter a tournament ID</ThemedText>
          </Toast>
        )
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verify the tournament exists
      await getTournament(trimmedId);
      // Add the player to the tournament
      const team = await addTeam(
        trimmedId,
        basicPlayerInfo?._id || '',
        basicPlayerInfo?.name || ''
      );
      router.push(`/tournament/${trimmedId}/${team._id}`);
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'join-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>Invalid tournament ID. Please try again.</ThemedText>
          </Toast>
        )
      });
      console.error('Error joining tournament:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 items-center justify-center p-5">
      <ThemedText type="title" className="mb-8">
        Create Tournament
      </ThemedText>
      <TextInput
        className="w-full p-4 mb-4 bg-white rounded-lg border border-gray-300 text-black"
        placeholder="Enter tournament name"
        value={tournamentName}
        onChangeText={setTournamentName}
      />
      <Button
        action="primary"
        variant="solid"
        size="lg"
        className="w-full mb-4"
        onPress={handleCreateTournament}
      >
        <ButtonText>Create Tournament</ButtonText>
      </Button>

      <View className="items-center w-full mb-8">
        <ThemedText type="title" className="mb-8">
          Join Tournament
        </ThemedText>
        <HStack className="items-center gap-4">
          <TextInput
            className="flex-1 p-4 bg-white rounded-lg border border-gray-300 text-black"
            placeholder="Enter tournament ID"
            value={manualTournamentId}
            onChangeText={setManualTournamentId}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="join"
            onSubmitEditing={handleManualJoin}
          />
          <Button
            className="w-full mt-4"
            action="primary"
            variant="solid"
            size="lg"
            onPress={handleManualJoin}
            isDisabled={isLoading}
          >
            <ButtonText>{isLoading ? 'Joining...' : 'Join'}</ButtonText>
          </Button>
        </HStack>
      </View>
    </ThemedView>
  );
}
