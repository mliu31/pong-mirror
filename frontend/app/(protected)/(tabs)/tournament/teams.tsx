import { View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/redux-hooks';
import { getAllTeams, addTeam, addPlayer } from '@/api/tournament';
import {
  Button,
  ButtonText,
  Text,
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@gluestack-ui/themed';

interface Team {
  id: string;
  name: string;
  players: string[];
}

export default function TournamentTeamsScreen() {
  const { tournamentId } = useLocalSearchParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const basicPlayerInfo = useAppSelector((state) => state.auth.basicPlayerInfo);

  useEffect(() => {
    fetchTeams();
  }, []);

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
      await addTeam(tournamentId as string, basicPlayerInfo?._id || '');
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      await addPlayer(teamId, basicPlayerInfo?._id || '');
      fetchTeams();
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  const renderTeam = ({ item }: { item: Team }) => {
    const isFull = item.players.length >= 2;
    const isPlayerInTeam = item.players.includes(basicPlayerInfo?.id || '');

    return (
      <Card className="mb-4">
        <CardHeader>
          <Text className="text-lg font-bold">{item.name}</Text>
        </CardHeader>
        <CardContent>
          <Text className="text-gray-600">
            Players: {item.players.length}/2
          </Text>
        </CardContent>
        {!isFull && !isPlayerInTeam && (
          <CardFooter>
            <Button
              size="sm"
              variant="solid"
              action="primary"
              onPress={() => handleJoinTeam(item.id)}
            >
              <ButtonText>Join Team</ButtonText>
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-6">Tournament Teams</Text>
      <Button
        size="lg"
        variant="solid"
        className="mb-6"
        onPress={handleCreateTeam}
      >
        <ButtonText>Create New Team</ButtonText>
      </Button>
      <FlatList
        data={teams}
        renderItem={renderTeam}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />
    </View>
  );
}
