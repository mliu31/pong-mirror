// display player's previous games played on the profile page

import { ScrollView } from 'react-native';
import { IGame } from '@/api/types';
import { Box } from '@/components/ui/box';
import { ThemedText } from '@/components/ThemedText';

interface IPreviousGames {
  games: IGame[];
  currentPlayerId: string;
}

export default function PreviousGames({
  games,
  currentPlayerId
}: IPreviousGames) {
  const sortedGames = [...games].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Box className="flex-1 my-2">
      <ScrollView showsVerticalScrollIndicator={true}>
        {sortedGames.map((game) => {
          const playerInfo = game.players.find(
            (p) => p.player._id === currentPlayerId
          );
          const team = playerInfo?.team;
          const winner = game.winner === team;
          const eloChange =
            (playerInfo?.newElo ?? 0) - (playerInfo?.oldElo ?? 0);
          const date = new Date(game.date);
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          const yy = String(date.getFullYear()).slice(-2);
          const gameDate = `${mm}/${dd}/${yy}`;
          console.log('raw game.date:', game.date);
          console.log('parsed date:', new Date(game.date));

          return (
            <Box
              key={game._id}
              className="bg-muted p-4 rounded-2xl mb-3 mx-4 w-[90%] self-center"
            >
              <ThemedText className="text-xs text-muted-foreground mb-2">
                {gameDate}
              </ThemedText>

              <Box className="flex-row justify-between items-center">
                <ThemedText className="text-base">Team: {team}</ThemedText>
                <ThemedText
                  className={`font-bold ${winner ? 'text-green-600' : 'text-red-600'}`}
                >
                  {winner ? 'Win' : 'Loss'}
                </ThemedText>
                <ThemedText
                  className={`font-bold text-sm ${eloChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {eloChange >= 0 ? '+' : ''}
                  {eloChange} ELO
                </ThemedText>
              </Box>
            </Box>
          );
        })}
      </ScrollView>
    </Box>
  );
}
