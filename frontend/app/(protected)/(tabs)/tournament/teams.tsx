import { View, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/redux-hooks';
import {
  getAllTeams,
  addTeam,
  addPlayer,
  getTournament,
  startTournament
} from '@/api/tournament';
import { Button, ButtonText, Card } from '@gluestack-ui/themed';
import { Toast, useToast } from '@/components/ui/toast';
import { ThemedText } from '@/components/ThemedText';

interface Team {
  id: string;
  name: string;
  players: string[];
}

export default function TournamentTeamsScreen() {
  const { tournamentId } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState<
    'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  >('PENDING');
  const [isLoading, setIsLoading] = useState(false);
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);

  useEffect(() => {
    fetchTeams();
    fetchTournamentStatus();
  }, []);

  const fetchTournamentStatus = async () => {
    try {
      const tournament = await getTournament(tournamentId as string);
      setTournamentStatus(tournament.status);
    } catch (error) {
      console.error('Error fetching tournament status:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const tournamentTeams = await getAllTeams(tournamentId as string);
      setTeams(
        tournamentTeams.map((teamId) => ({
          id: teamId,
          name: `Team ${teamId}`,
          players: []
        }))
      );
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const team = await addTeam(
        tournamentId as string,
        basicPlayerInfo?._id || '',
        basicPlayerInfo?.name || ''
      );
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      await addPlayer(
        tournamentId as string,
        teamId,
        basicPlayerInfo?._id || ''
      );
      fetchTeams();
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  const handleStartTournament = async () => {
    if (teams.length < 2) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'start-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>
              Need at least 2 teams to start the tournament
            </ThemedText>
          </Toast>
        )
      });
      return;
    }

    setIsLoading(true);
    try {
      await startTournament(tournamentId as string);
      await fetchTournamentStatus();
      // Navigate to the tournament bracket view
      router.push(`/tournament/${tournamentId}`);
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'start-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>
              Failed to start tournament. Please try again.
            </ThemedText>
          </Toast>
        )
      });
      console.error('Error starting tournament:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTeam = ({ item }: { item: Team }) => {
    const isFull = item.players.length >= 2;
    const isPlayerInTeam = item.players.includes(basicPlayerInfo?._id || '');

    return (
      <Card className="mb-4">
        <View>
          <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        </View>
        <View>
          <ThemedText>Players: {item.players.length}/2</ThemedText>
        </View>
        {!isFull && !isPlayerInTeam && tournamentStatus === 'PENDING' && (
          <View>
            <Button onPress={() => handleJoinTeam(item.id)}>
              <ButtonText>Join Team</ButtonText>
            </Button>
          </View>
        )}
      </Card>
    );
  };

  return (
    <View className="flex-1 p-5">
      <ThemedText type="title" className="mb-6">
        Tournament Teams
      </ThemedText>
      {tournamentStatus === 'PENDING' && (
        <>
          <Button className="mb-6" onPress={handleCreateTeam}>
            <ButtonText>Create New Team</ButtonText>
          </Button>
          <Button
            className="mb-6"
            onPress={handleStartTournament}
            isDisabled={isLoading}
          >
            <ButtonText>
              {isLoading ? 'Starting...' : 'Start Tournament'}
            </ButtonText>
          </Button>
        </>
      )}
      {tournamentStatus === 'IN_PROGRESS' && (
        <ThemedText type="defaultSemiBold" className="mb-6 text-primary-500">
          Tournament in progress
        </ThemedText>
      )}
      {tournamentStatus === 'COMPLETED' && (
        <ThemedText type="defaultSemiBold" className="mb-6 text-success-500">
          Tournament completed
        </ThemedText>
      )}
      <FlatList
        data={teams}
        renderItem={renderTeam}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />
    </View>
  );
}
