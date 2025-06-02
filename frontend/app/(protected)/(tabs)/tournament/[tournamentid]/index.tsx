import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, ButtonText } from '@/components/ui/button';
import {
  getTournament,
  startTournament,
  TournamentResponse,
  getTeam,
  updateMatchWinner,
  addPlayer
} from '@/api/tournament';
import { getPlayer } from '@/api/players';
import { useAppSelector } from '@/redux/redux-hooks';
import TeamChips from '@/components/TeamChips';
import { Game } from '@/api/types';
import TEAM from '@/constants/TEAM';
import Clipboard from '@react-native-clipboard/clipboard';

interface Team {
  _id: string;
  name: string;
  players: string[];
  elo: number;
  seed: number;
}

interface TournamentMatch {
  _id: string;
  team1: string | null;
  team2: string | null;
  winner: 'LEFT' | 'RIGHT' | null;
  bye: boolean;
  gameId: string;
}

export default function TournamentDetailScreen() {
  const local = useLocalSearchParams();
  const tournamentId = local.tournamentid;
  const router = useRouter();
  const [tournament, setTournament] = useState<TournamentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);
  const isAdmin = basicPlayerInfo?._id === tournament?.admin;

  const fetchTournament = async () => {
    try {
      const tournamentData = await getTournament(tournamentId as string);
      setTournament(tournamentData);

      // Fetch team data for each team ID
      const teamPromises = tournamentData.teams.map((teamId) =>
        getTeam(teamId)
      );
      const teamData = await Promise.all(teamPromises);
      setTeams(teamData);

      // Fetch player names for all players in all teams
      const allPlayerIds = teamData.flatMap((team) => team.players);
      const uniquePlayerIds = [...new Set(allPlayerIds)];
      const playerNamePromises = uniquePlayerIds.map(async (playerId) => {
        try {
          const response = await getPlayer(playerId);
          return [playerId, response.data.name];
        } catch (error) {
          console.error(`Error fetching player ${playerId}:`, error);
          return [playerId, 'Unknown Player'];
        }
      });
      const playerNameResults = await Promise.all(playerNamePromises);
      const playerNameMap = Object.fromEntries(playerNameResults);
      setPlayerNames(playerNameMap);
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

  const handleStartTournament = async () => {
    try {
      await startTournament(tournamentId as string);
      fetchTournament();
    } catch (error) {
      console.error('Error starting tournament:', error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!basicPlayerInfo?._id) {
      alert('Player information not found. Please try again.');
      return;
    }
    try {
      await addPlayer(tournamentId as string, teamId, basicPlayerInfo._id);
      router.push(`/tournament/${tournamentId}/${teamId}`);
    } catch (error) {
      console.error('Error adding player to team:', error);
      alert('Failed to join team. Please try again.');
    }
  };

  const handleSetWinner = async (matchId: string, winnerId: string) => {
    try {
      const teamIndex = teams.findIndex((team) => team._id === winnerId);
      if (teamIndex === -1) {
        console.error('Team not found');
        return;
      }
      let side: 'LEFT' | 'RIGHT';
      if (teamIndex === 0) {
        side = 'LEFT';
      } else {
        side = 'RIGHT';
      }
      const updatedTournament = await updateMatchWinner(
        tournamentId as string,
        matchId,
        side
      );

      // Check if tournament is complete (only one team left)
      if (updatedTournament.status === 'COMPLETED') {
        // Find the winning team
        const winningTeam = teams.find((team) => team._id === winnerId);
        if (winningTeam) {
          // Navigate to winner screen
          router.push({
            pathname: '/(protected)/(tabs)/tournament/[tournamentid]/winner',
            params: {
              tournamentid: tournamentId as string,
              teamName: winningTeam.name
            }
          });
        }
      } else {
        fetchTournament();
      }
    } catch (error) {
      console.error('Error setting match winner:', error);
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

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1 p-5">
        <ThemedText type="title" className="mb-4">
          {tournament.name}
        </ThemedText>

        <View className="mb-4">
          <ThemedText className="text-lg">
            Status: {tournament.status}
          </ThemedText>
          <ThemedText className="text-lg">
            Teams: {tournament.teams.length}
          </ThemedText>
        </View>

        <View className="mb-4 p-4 bg-gray-100 rounded-lg">
          <ThemedText
            type="subtitle"
            className="mb-2"
            lightColor="#000"
            darkColor="#000"
          >
            Tournament ID
          </ThemedText>
          <View className="flex-row items-center justify-between">
            <ThemedText
              className="text-lg font-mono"
              lightColor="#000"
              darkColor="#000"
            >
              {tournamentId}
            </ThemedText>
            <Button
              action="primary"
              variant="solid"
              size="sm"
              onPress={() => {
                Clipboard.setString(tournamentId as string);
              }}
            >
              <ButtonText>Copy ID</ButtonText>
            </Button>
          </View>
        </View>

        {tournament.status === 'PENDING' && (
          <View className="mb-4">
            <ThemedText type="subtitle" className="mb-2">
              Teams
            </ThemedText>
            {teams.map((team) => (
              <View key={team._id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                <ThemedText
                  className="text-lg font-semibold mb-2"
                  lightColor="#000"
                  darkColor="#000"
                  style={{ color: '#000', opacity: 1 }}
                >
                  {team.players.length === 2
                    ? `${playerNames[team.players[0]] || 'Loading...'} and ${playerNames[team.players[1]] || 'Loading...'}`
                    : `${playerNames[team.players[0]] || 'Loading...'} and Guest`}
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
                  onPress={() => handleJoinTeam(team._id)}
                >
                  <ButtonText>Join Team</ButtonText>
                </Button>
              </View>
            ))}
            <View style={{ height: 100 }} />
          </View>
        )}

        {tournament.status === 'IN_PROGRESS' && (
          <View className="mt-4">
            <ThemedText type="subtitle" className="mb-2">
              Current Round: {tournament.currentRound}
            </ThemedText>
            {tournament.bracket.map(
              (round: { round: number; matches: TournamentMatch[] }) => (
                <View key={round.round} className="mb-4">
                  <ThemedText className="font-semibold mb-2">
                    Round {round.round}
                  </ThemedText>
                  {round.matches.map(
                    (match: TournamentMatch, index: number) => {
                      const team1 = teams.find(
                        (team) => team._id === match.team1
                      );
                      const team2 = teams.find(
                        (team) => team._id === match.team2
                      );
                      const winner = match.winner;

                      return (
                        <View
                          key={index}
                          className="p-3 bg-gray-100 text-black rounded-lg mb-2"
                        >
                          <ThemedText
                            lightColor="#000"
                            darkColor="#000"
                            style={{ color: '#000', opacity: 1 }}
                          >
                            {team1?.name || 'TBD'} vs {team2?.name || 'TBD'}
                          </ThemedText>
                          {winner && (
                            <ThemedText
                              lightColor="#000"
                              darkColor="#000"
                              style={{ color: '#000', opacity: 1 }}
                              className="text-green-600"
                            >
                              Winner:{' '}
                              {winner === TEAM.LEFT ? team1?.name : team2?.name}
                            </ThemedText>
                          )}
                          {!team2 && (
                            <ThemedText
                              lightColor="#000"
                              darkColor="#000"
                              style={{ color: '#000', opacity: 1 }}
                              className="text-blue-600"
                            >
                              Bye: {team1?.name}
                            </ThemedText>
                          )}
                          {!winner && team1 && team2 && (
                            <View className="flex-row justify-between mt-2">
                              <Button
                                action="primary"
                                variant="solid"
                                size="sm"
                                onPress={() =>
                                  handleSetWinner(match._id, team1._id)
                                }
                              >
                                <ButtonText>{team1.name} Wins</ButtonText>
                              </Button>
                              <Button
                                action="primary"
                                variant="solid"
                                size="sm"
                                onPress={() =>
                                  handleSetWinner(match._id, team2._id)
                                }
                              >
                                <ButtonText>{team2.name} Wins</ButtonText>
                              </Button>
                            </View>
                          )}
                        </View>
                      );
                    }
                  )}
                </View>
              )
            )}
          </View>
        )}
      </ScrollView>

      {tournament.status === 'PENDING' && isAdmin && teams.length >= 2 && (
        <View style={{ position: 'absolute', bottom: 32, left: 20, right: 20 }}>
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
    </ThemedView>
  );
}
