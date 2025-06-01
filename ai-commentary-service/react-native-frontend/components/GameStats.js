import React from 'react';
import { View, Text } from 'react-native';
import { gameStyles } from '../styles/gameStyles';
import { TEAMS } from '../utils/constants';

const GameStats = ({ gameState }) => {
  if (!gameState) {
    return (
      <View style={gameStyles.statsContainer}>
        <View style={gameStyles.statsHeader}>
          <Text style={gameStyles.commentaryPlaceholder}>
            No game data available
          </Text>
        </View>
      </View>
    );
  }

  const redTeam = TEAMS.red;
  const blueTeam = TEAMS.blue;

  const StatRow = ({ label, value }) => (
    <View style={gameStyles.statRow}>
      <Text style={gameStyles.statLabel}>{label}:</Text>
      <Text style={gameStyles.statValue}>{value}</Text>
    </View>
  );

  const TeamStats = ({ team, stats }) => (
    <View style={gameStyles.teamStats}>
      <Text style={[gameStyles.teamName, { color: team.color }]}>
        {team.name}
      </Text>
      <StatRow label="Full Cups" value={stats.full} />
      <StatRow label="Half Cups" value={stats.half} />
      <StatRow label="Empty Cups" value={stats.empty} />
      <StatRow label="Total Remaining" value={stats.full + stats.half} />
    </View>
  );

  return (
    <View style={gameStyles.statsContainer}>
      <View style={gameStyles.statsHeader}>
        <TeamStats
          team={redTeam}
          stats={{
            full: gameState.red_full,
            half: gameState.red_half,
            empty: gameState.red_empty
          }}
        />

        <View
          style={{ width: 1, backgroundColor: '#ddd', marginHorizontal: 20 }}
        />

        <TeamStats
          team={blueTeam}
          stats={{
            full: gameState.blue_full,
            half: gameState.blue_half,
            empty: gameState.blue_empty
          }}
        />
      </View>
    </View>
  );
};

export default GameStats;
