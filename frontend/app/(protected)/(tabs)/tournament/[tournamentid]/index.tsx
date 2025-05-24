import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, ButtonText } from '@/components/ui/button';
import {
  getTournament,
  startTournament,
  TournamentResponse
} from '@/api/tournament';
import { useAppSelector } from '@/redux/redux-hooks';
import TeamChips from '@/components/TeamChips';

interface Match {
  team1: string | null;
  team2: string | null;
  winner: string | null;
  bye: boolean;
  gameId: string;
}

export default function TournamentDetailScreen() {
  const local = useLocalSearchParams();
  const tournamentId = local.tournamentid;
  const router = useRouter();
  const [tournament, setTournament] = useState<TournamentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);

  const fetchTournament = async (tournamentId: string) => {
    try {
      const data = await getTournament(tournamentId);
      setTournament(data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament(tournamentId as string);
    // Set up polling for tournament updates
    const interval = setInterval(fetchTournament, 5000);
    return () => clearInterval(interval);
  }, [tournamentId]);

  const handleStartTournament = async () => {
    try {
      await startTournament(tournamentId as string);
      fetchTournament(tournamentId as string);
    } catch (error) {
      console.error('Error starting tournament:', error);
    }
  };

  const handleJoinTeam = (teamId: string) => {
    router.push(`/tournament/${tournamentId}/${teamId}`);
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText>Loading tournament...</ThemedText>
      </ThemedView>
    );
  }

  if (!tournament) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText>Tournament not found</ThemedText>
      </ThemedView>
    );
  }

  const isAdmin = tournament.teams.includes(basicPlayerInfo?._id || '');

  return (
    <ThemedView className="flex-1 p-5">
      <ThemedText type="title" className="mb-4">
        {tournament.name}
      </ThemedText>

      <View className="mb-4">
        <ThemedText className="text-lg">Status: {tournament.status}</ThemedText>
        <ThemedText className="text-lg">
          Teams: {tournament.teams.length}
        </ThemedText>
      </View>

      {tournament.status === 'PENDING' && (
        <View className="mb-4">
          <ThemedText type="subtitle" className="mb-2">
            Teams
          </ThemedText>
          {tournament.teams.map((teamId: string) => (
            <View key={teamId} className="mb-4 p-4 bg-gray-100 rounded-lg">
              <ThemedText className="text-lg font-semibold mb-2">
                Team {teamId}
              </ThemedText>
              <TeamChips
                leftTeam={[]}
                rightTeam={[]}
                teamBoxHeight={200}
                showLeftBorder={false}
                showRightBorder={false}
              />
              <Button
                action="primary"
                variant="solid"
                size="sm"
                className="mt-2"
                onPress={() => handleJoinTeam(teamId)}
              >
                <ButtonText>Join Team</ButtonText>
              </Button>
            </View>
          ))}
          {isAdmin && tournament.teams.length >= 2 && (
            <Button
              action="primary"
              variant="solid"
              size="lg"
              className="w-full mt-4"
              onPress={handleStartTournament}
            >
              <ButtonText>Start Tournament</ButtonText>
            </Button>
          )}
        </View>
      )}

      {tournament.status === 'IN_PROGRESS' && (
        <View className="mt-4">
          <ThemedText type="subtitle" className="mb-2">
            Current Round: {tournament.currentRound}
          </ThemedText>
          {tournament.bracket.map(
            (round: { round: number; matches: Match[] }) => (
              <View key={round.round} className="mb-4">
                <ThemedText className="font-semibold mb-2">
                  Round {round.round}
                </ThemedText>
                {round.matches.map((match: Match, index: number) => {
                  const team1 = match.team1;
                  const team2 = match.team2;
                  const winner = match.winner;

                  return (
                    <View
                      key={index}
                      className="p-3 bg-gray-100 rounded-lg mb-2"
                    >
                      <ThemedText>
                        {team1 || 'TBD'} vs {team2 || 'TBD'}
                      </ThemedText>
                      {match.winner && (
                        <ThemedText className="text-green-600">
                          Winner: {winner}
                        </ThemedText>
                      )}
                      {match.bye && (
                        <ThemedText className="text-blue-600">
                          Bye: {team1}
                        </ThemedText>
                      )}
                    </View>
                  );
                })}
              </View>
            )
          )}
        </View>
      )}
    </ThemedView>
  );
}
