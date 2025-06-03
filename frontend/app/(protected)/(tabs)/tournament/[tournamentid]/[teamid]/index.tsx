import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, ButtonText } from '@/components/ui/button';
import {
  getTeam,
  getTournament,
  startTournament,
  leaveTeam
} from '@/api/tournament';
import { useAppSelector } from '@/redux/redux-hooks';
import { IPlayer } from '@/api/types';
import { getPlayer } from '@/api/players';
import { Toast, useToast } from '@/components/ui/toast';

interface Team {
  _id: string;
  elo: number;
  players: string[];
  seed: number;
  name: string;
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
  teams: string[];
  currentRound: number;
  bracket: {
    round: number;
    matches: Match[];
  }[];
  admin: string;
}

export default function TeamTournamentScreen() {
  const local = useLocalSearchParams();
  const tournamentId = local.tournamentid;
  const teamId = local.teamid;
  const router = useRouter();
  const toast = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<IPlayer[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);
  const isAdmin = basicPlayerInfo?._id === tournament?.admin;

  const fetchTournament = async () => {
    try {
      const tournamentData = await getTournament(tournamentId as string);
      console.log('this is the team data');
      console.log(teamPlayers);
      setTournament(tournamentData);

      // Fetch team data for each team ID
      const teamPromises = tournamentData.teams.map((teamId) =>
        getTeam(teamId)
      );
      const teamData = await Promise.all(teamPromises);
      setTeams(teamData);
    } catch (error) {
      console.error('Error fetching tournament:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeam = async () => {
    console.log('fetching team');
    try {
      const teamData = await getTeam(teamId as string);
      console.log('this is the team data');
      console.log(teamData);
      setTeam(teamData);

      // Fetch player data for each player ID
      const playerPromises = teamData.players.map((playerId) =>
        getPlayer(playerId)
      );
      const playerResponses = await Promise.all(playerPromises);
      const players = playerResponses.map((response) => response.data);
      setTeamPlayers(players);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament();
    fetchTeam();
    // Set up polling for tournament updates
    const interval = setInterval(fetchTournament, 5000);
    return () => clearInterval(interval);
  }, []);

  // Add effect to handle navigation when tournament is completed or team is eliminated
  useEffect(() => {
    if (tournament?.status === 'COMPLETED') {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="info"
            variant="outline"
            nativeID={'tournament-ended-toast-' + id}
            className="p-4 gap-6 border-info-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>Tournament has ended</ThemedText>
          </Toast>
        )
      });
      router.replace('/(protected)/(tabs)/tournament');
      return;
    }

    // Check if team is eliminated
    if (tournament?.status === 'IN_PROGRESS' && team) {
      const isTeamEliminated = tournament.bracket.every((round) => {
        const teamMatches = round.matches.filter(
          (match) => match.team1 === team._id || match.team2 === team._id
        );
        return teamMatches.every((match) => {
          if (match.team1 === team._id) {
            return match.winner === 'RIGHT';
          } else if (match.team2 === team._id) {
            return match.winner === 'LEFT';
          }
          return false;
        });
      });

      if (isTeamEliminated) {
        toast.show({
          render: ({ id }) => (
            <Toast
              action="info"
              variant="outline"
              nativeID={'team-eliminated-toast-' + id}
              className="p-4 gap-6 border-info-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
            >
              <ThemedText>
                Your team has been eliminated from the tournament
              </ThemedText>
            </Toast>
          )
        });
        router.replace('/(protected)/(tabs)/tournament');
      }
    }
  }, [tournament?.status, tournament?.bracket, team, router, toast]);

  const handleJoinGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  const handleStartTournament = async () => {
    try {
      await startTournament(tournamentId as string);
      fetchTournament(); // Refresh tournament data
    } catch (error) {
      console.error('Error starting tournament:', error);
    }
  };

  const handleLeaveTeam = async () => {
    try {
      const result = await leaveTeam(
        tournamentId as string,
        teamId as string,
        basicPlayerInfo?._id || ''
      );

      console.log('this is the result');
      console.log(result);

      // Show success toast
      toast.show({
        render: ({ id }) => (
          <Toast
            action="success"
            variant="outline"
            nativeID={'leave-success-toast-' + id}
            className="p-4 gap-6 border-success-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>Successfully left the team</ThemedText>
          </Toast>
        )
      });

      // Navigate back to tournament page
      router.replace(`/tournament/${tournamentId}`);
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={'leave-error-toast-' + id}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <ThemedText>Failed to leave team. Please try again.</ThemedText>
          </Toast>
        )
      });
      console.error('Error leaving team:', error);
    }
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

  if (!team) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText>Team not found</ThemedText>
      </ThemedView>
    );
  }

  const currentMatch = tournament.bracket
    .flatMap((round) => round.matches)
    .find((match) => match.team1 === teamId || match.team2 === teamId);

  const isPlayerInTeam = team.players.includes(basicPlayerInfo?._id || '');

  return (
    <ThemedView className="flex-1 p-5">
      <ThemedText type="title" className="mb-4">
        {team.name}
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
        {teamPlayers.map((player, index) => (
          <ThemedText key={player._id} className="mb-1">
            {index + 1}. {player.name}
          </ThemedText>
        ))}
      </View>

      {isPlayerInTeam && tournament.status === 'PENDING' && (
        <View className="mb-4">
          <Button size="lg" className="w-full" onPress={handleLeaveTeam}>
            <ButtonText>Leave Team</ButtonText>
          </Button>
        </View>
      )}

      {tournament.status === 'PENDING' && isAdmin && teams.length >= 2 && (
        <View className="mb-4">
          <Button
            action="primary"
            variant="solid"
            size="lg"
            className="w-full"
            onPress={handleStartTournament}
          >
            <ButtonText>Start Tournament</ButtonText>
          </Button>
        </View>
      )}

      {tournament.status === 'IN_PROGRESS' && currentMatch && (
        <View className="mb-4">
          <ThemedText type="subtitle" className="mb-2">
            Current Match
          </ThemedText>
          <View className="p-4 bg-[#277f5a] rounded-lg">
            <ThemedText className="mb-2 text-black">
              {currentMatch.team1 === teamId
                ? team.name
                : teams.find((t) => t._id === currentMatch.team1)?.name ||
                  'TBD'}{' '}
              vs{' '}
              {currentMatch.team2 === teamId
                ? team.name
                : teams.find((t) => t._id === currentMatch.team2)?.name ||
                  'TBD'}
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
                const team1Data = teams.find((t) => t._id === match.team1);
                const team2Data = teams.find((t) => t._id === match.team2);
                const winnerData = teams.find((t) => t._id === match.winner);
                const isCurrentTeamMatch =
                  match.team1 === teamId || match.team2 === teamId;

                return (
                  <View
                    key={index}
                    className={`p-3 rounded-lg mb-2 bg-[#277f5a] ${
                      isCurrentTeamMatch ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <ThemedText>
                      {team1Data?.name || 'TBD'} vs {team2Data?.name || 'TBD'}
                    </ThemedText>
                    {match.winner && (
                      <ThemedText className="text-green-600">
                        Winner: {winnerData?.name}
                      </ThemedText>
                    )}
                    {match.bye && (
                      <ThemedText className="text-blue-600">
                        Bye: {team1Data?.name}
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
