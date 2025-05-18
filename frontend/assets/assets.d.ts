declare module '*.ttf' {
  const value: import('expo-font').FontSource;
  export default value;
}

declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const SvgComponent: React.FC<SvgProps>;
  export default SvgComponent;
}
