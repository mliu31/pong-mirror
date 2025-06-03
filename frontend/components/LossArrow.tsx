import Svg, { Path } from 'react-native-svg';

const LossArrow = ({ size = 40 }: { size?: number }) => (
  <Svg width={size} height={(size * 25) / 40} viewBox="0 0 40 25" fill="none">
    <Path
      fill="#EA4335"
      d="M35.3 0 20 15.452 4.7 0 0 4.757 20 25 40 4.757 35.3 0Z"
    />
  </Svg>
);

export default LossArrow;
