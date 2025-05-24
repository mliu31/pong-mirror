import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, ButtonText } from '@/components/ui/button';
import { getTournament } from '@/api/tournament';
import { useAppSelector } from '@/redux/redux-hooks';
import TeamChips from '@/components/TeamChips';

interface Team {
  _id: string;
  name: string;
  players: {
    _id: string;
    name: string;
  }[];
}

interface Match {
  team1: string | null;
  team2: string | null;
  winner: string | null;
  bye: boolean;
  gameId: string;
}

interface Tournament {
  _id: string;
  name: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  teams: Team[];
  currentRound: number;
  bracket: {
    round: number;
    matches: Match[];
  }[];
}

export default function TeamTournamentScreen() {
  const { tournamentId, teamId } = useLocalSearchParams();
  console.log(tournamentId, teamId);
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);

  const fetchTournament = async () => {
    try {
      const data = await getTournament(tournamentId as string);
      setTournament(data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament();
    // Set up polling for tournament updates
    const interval = setInterval(fetchTournament, 5000);
    return () => clearInterval(interval);
  }, [tournamentId]);

  const handleJoinGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
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

  const currentTeam = tournament.teams.find((t) => t._id === teamId);
  if (!currentTeam) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText>Team not found</ThemedText>
      </ThemedView>
    );
  }

  const currentMatch = tournament.bracket
    .flatMap((round) => round.matches)
    .find((match) => match.team1 === teamId || match.team2 === teamId);

  const isPlayerInTeam = currentTeam.players.some(
    (player) => player._id === basicPlayerInfo?._id
  );

  return (
    <ThemedView className="flex-1 p-5">
      <ThemedText type="title" className="mb-4">
        {currentTeam.name}
      </ThemedText>

      <View className="mb-4">
        <ThemedText className="text-lg">
          Tournament: {tournament.name}
        </ThemedText>
        <ThemedText className="text-lg">Status: {tournament.status}</ThemedText>
      </View>

      <View className="mb-4">
        <ThemedText type="subtitle" className="mb-2">
          Team Members
        </ThemedText>
        <TeamChips
          leftTeam={currentTeam.players}
          rightTeam={[]}
          teamBoxHeight={200}
          showLeftBorder={false}
          showRightBorder={false}
        />
      </View>

      {tournament.status === 'IN_PROGRESS' && currentMatch && (
        <View className="mb-4">
          <ThemedText type="subtitle" className="mb-2">
            Current Match
          </ThemedText>
          <View className="p-4 bg-gray-100 rounded-lg">
            <ThemedText className="text-lg mb-2">
              {currentMatch.team1 === teamId ? 'You' : 'Opponent'} vs{' '}
              {currentMatch.team2 === teamId ? 'You' : 'Opponent'}
            </ThemedText>
            {currentMatch.winner && (
              <ThemedText className="text-green-600 mb-2">
                Winner: {currentMatch.winner === teamId ? 'You' : 'Opponent'}
              </ThemedText>
            )}
            {isPlayerInTeam && !currentMatch.winner && !currentMatch.bye && (
              <Button
                action="primary"
                variant="solid"
                size="lg"
                className="w-full"
                onPress={() => handleJoinGame(currentMatch.gameId)}
              >
                <ButtonText>Join Game</ButtonText>
              </Button>
            )}
          </View>
        </View>
      )}

      {tournament.status === 'IN_PROGRESS' && (
        <View className="mt-4">
          <ThemedText type="subtitle" className="mb-2">
            Tournament Bracket
          </ThemedText>
          {tournament.bracket.map((round) => (
            <View key={round.round} className="mb-4">
              <ThemedText className="font-semibold mb-2">
                Round {round.round}
              </ThemedText>
              {round.matches.map((match, index) => {
                const team1 = tournament.teams.find(
                  (t) => t._id === match.team1
                );
                const team2 = tournament.teams.find(
                  (t) => t._id === match.team2
                );
                const winner = tournament.teams.find(
                  (t) => t._id === match.winner
                );
                const isCurrentTeamMatch =
                  match.team1 === teamId || match.team2 === teamId;

                return (
                  <View
                    key={index}
                    className={`p-3 rounded-lg mb-2 ${
                      isCurrentTeamMatch ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <ThemedText>
                      {team1?.name || 'TBD'} vs {team2?.name || 'TBD'}
                    </ThemedText>
                    {match.winner && (
                      <ThemedText className="text-green-600">
                        Winner: {winner?.name}
                      </ThemedText>
                    )}
                    {match.bye && (
                      <ThemedText className="text-blue-600">
                        Bye: {team1?.name}
                      </ThemedText>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </ThemedView>
  );
}
