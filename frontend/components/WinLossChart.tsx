import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

interface WinLossPieChartProps {
  wins: number;
  losses: number;
}

export default function WinLossChart({ wins, losses }: WinLossPieChartProps) {
  const total = wins + losses;

  // if no games played yet
  if (total === 0) {
    return (
      <View style={styles.centered}>
        <Text>No games played yet</Text>
      </View>
    );
  }

  const winRate = ((wins / total) * 100).toFixed(1);

  const data = [
    {
      value: wins,
      color: '#4CAF50'
    },
    {
      value: losses,
      color: '#F44336'
    }
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.stats}>
        <Text style={styles.statsText}>Won: {wins}</Text>
        <Text style={styles.statsText}>Lost: {losses}</Text>
      </View>

      {/* pie chart with win rate at center */}
      <PieChart
        data={data}
        donut
        showGradient
        innerRadius={60}
        radius={100}
        centerLabelComponent={() => (
          <View style={styles.centerLabel}>
            <Text style={styles.centerLabelText}>{winRate}%</Text>
          </View>
        )}
        showValuesAsLabels={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16
  },
  stats: {
    marginRight: 24,
    alignItems: 'flex-end'
  },
  statsText: {
    fontSize: 16,
    marginVertical: 4
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerLabelText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180
  }
});
