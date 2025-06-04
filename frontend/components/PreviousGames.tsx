// display player's previous games played on the profile page

import { ScrollView } from 'react-native';
import { IGame } from '@/api/types';
import { Box } from '@/components/ui/box';
import { ThemedText } from '@/components/ThemedText';
import LossArrow from '@/components/LossArrow';
import WinArrow from '@/components/WinArrow';

interface IPreviousGames {
  games: IGame[];
  currentPlayerId: string;
}

// function to get player intials
const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return names[0][0] + names[names.length - 1][0];
  }
  return names[0][0];
};

// a scrollable view of players' previous games
export default function PreviousGames({
  games,
  currentPlayerId
}: IPreviousGames) {
  // sort by date
  const sortedGames = [...games].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Box className="flex-1 my-2">
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={{ maxHeight: 3 * 100 }}
      >
        {sortedGames.map((game) => {
          const playerInfo = game.players.find(
            (p) => p.player._id === currentPlayerId
          );
          const team = playerInfo?.team ?? 'null';
          const teamsMap = game.players.reduce<Record<string, string[]>>(
            (acc, p) => {
              const teamName = p.team ?? 'null';
              if (!acc[teamName]) acc[teamName] = [];
              acc[teamName].push(getInitials(p.player.name));
              return acc;
            },
            {}
          );
          const otherTeam =
            Object.keys(teamsMap).find((t) => t !== team) ?? 'null';
          const winner = game.winner;
          const oldElo = playerInfo?.oldElo;
          const newElo = playerInfo?.newElo;
          const eloChange = (newElo ?? 0) - (oldElo ?? 0);
          const date = new Date(game.date);
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          const yy = String(date.getFullYear()).slice(-2);
          const gameDate = `${mm}/${dd}/${yy}`;

          return (
            <Box
              key={game._id}
              className="bg-muted p-4 rounded-2xl mb-1 mx-4 w-[90%] self-center"
            >
              <ThemedText className="text-l">{gameDate}</ThemedText>

              <Box className="flex-row justify-between items-right">
                {/* print team vs. team */}
                <Box className="mb-2 items-start pl-4">
                  <ThemedText
                    className="text-l font-bold mb-1"
                    style={{
                      color: team === winner ? '#65b684' : '#ea4236',
                      lineHeight: 14
                    }}
                  >
                    {teamsMap[team]?.join(', ')}
                  </ThemedText>
                  {/* TODO: display Elo aligned */}
                  {/* <ThemedText className="text-s text-typography-900">
                    {oldElo} → {newElo}
                  </ThemedText> */}

                  <ThemedText
                    className="text-s mb-1"
                    style={{ lineHeight: 16 }}
                  >
                    vs.
                  </ThemedText>

                  <ThemedText
                    className="text-l font-bold"
                    style={{
                      color: otherTeam === winner ? '#65b684' : '#ea4236',
                      lineHeight: 14
                    }}
                  >
                    {teamsMap[otherTeam]?.join(', ')}
                  </ThemedText>
                  {/* <ThemedText className="text-s text-typography-900">
                    {oldElo} → {newElo}
                  </ThemedText> */}
                </Box>

                {/* print elo changes */}
                <Box className="flex-col items-center">
                  {winner ? <WinArrow size={40} /> : <LossArrow size={40} />}
                  <ThemedText className="text-l font-bold mt-1">
                    {eloChange >= 0 ? '+' : ''}
                    {eloChange} Elo
                  </ThemedText>
                </Box>
              </Box>
            </Box>
          );
        })}
      </ScrollView>
    </Box>
  );
}
