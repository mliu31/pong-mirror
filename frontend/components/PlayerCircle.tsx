import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface PlayerCircleProps {
  name: string;
  size?: number;
  bgLightColor: string;
  bgDarkColor: string;
  textLightColor: string;
  textDarkColor: string;
}

const PlayerCircle = ({
  name,
  size = 40,
  bgLightColor,
  bgDarkColor,
  textLightColor,
  textDarkColor
}: PlayerCircleProps) => {
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length > 1) {
      return (
        names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
      );
    }
    return names[0][0].toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <ThemedView
      lightColor={bgLightColor}
      darkColor={bgDarkColor}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 0,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <ThemedText
        lightColor={textLightColor}
        darkColor={textDarkColor}
        style={{ fontWeight: 'bold', fontSize: size / 2 }}
      >
        {initials}
      </ThemedText>
    </ThemedView>
  );
};

export default PlayerCircle;
