import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { gameStyles } from '../styles/gameStyles';

const CommentaryBox = ({ commentary, commentator, timestamp, loading }) => {
  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <View style={gameStyles.commentaryContainer}>
      <View style={gameStyles.commentaryHeader}>
        <Text style={gameStyles.commentaryTitle}>Live Commentary</Text>
      </View>

      <ScrollView style={gameStyles.commentaryContent}>
        {loading ? (
          <Text style={gameStyles.commentaryPlaceholder}>
            Generating commentary...
          </Text>
        ) : commentary ? (
          <>
            <Text style={gameStyles.commentaryText}>{commentary}</Text>
            {(commentator || timestamp) && (
              <View style={gameStyles.commentaryMeta}>
                {commentator && (
                  <Text style={gameStyles.commentator}>- {commentator}</Text>
                )}
                {timestamp && (
                  <Text style={gameStyles.timestamp}>
                    {formatTimestamp(timestamp)}
                  </Text>
                )}
              </View>
            )}
          </>
        ) : (
          <Text style={gameStyles.commentaryPlaceholder}>
            No commentary yet. Add some actions to get started!
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default CommentaryBox;
