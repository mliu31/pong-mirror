import { PieChart } from 'react-native-gifted-charts';
import { Box } from '@/components/ui/box';
import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';

interface WinLossPieChart {
  wins: number;
  losses: number;
}

export default function WinLossChart({ wins, losses }: WinLossPieChart) {
  const total = wins + losses;

  if (total === 0) {
    return (
      <Box className="h-44 items-center justify-center">
        <ThemedText>No games played yet</ThemedText>
      </Box>
    );
  }

  const winRate = ((wins / total) * 100).toFixed(1);

  const data = [
    { value: wins, color: '#65b684' },
    { value: losses, color: '#ea4236' }
  ];

  return (
    <Box className="flex-row items-center justify-center my-4">
      <Box className="mr-6 items-end">
        <ThemedText className="text-base my-1" style={{ color: '#65b684' }}>
          Won: <ThemedText style={{ color: '#ffffff' }}>{wins}</ThemedText>
        </ThemedText>

        <ThemedText className="text-base my-1" style={{ color: '#ea4236' }}>
          Lost: <ThemedText style={{ color: '#ffffff' }}>{losses}</ThemedText>
        </ThemedText>
      </Box>

      <PieChart
        data={data}
        donut
        showGradient={false}
        innerRadius={40}
        radius={85}
        centerLabelComponent={() => (
          <View
            className="justify-center items-center"
            style={{
              backgroundColor: '#000',
              borderRadius: 60,
              width: 120,
              height: 120
            }}
          >
            <ThemedText className="text-white font-bold text-base text-center">
              Win Rate {winRate}%
            </ThemedText>
          </View>
        )}
        showValuesAsLabels={false}
      />
    </Box>
  );
}
