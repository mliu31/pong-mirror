import Svg, { Path } from 'react-native-svg';

const WinArrow = ({ size = 40 }: { size?: number }) => (
  <Svg width={size} height={(size * 25) / 40} viewBox="0 0 40 25" fill="none">
    <Path
      fill="#65b684"
      d="M4.7 25 20 9.548 35.3 25l4.7-4.757L20 0 0 20.243 4.7 25Z"
    />
  </Svg>
);

export default WinArrow;
