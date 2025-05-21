import Svg, { Path, Circle } from 'react-native-svg';

const BeerPongCupIcon = (props: { size?: number; color?: string }) => {
  const size = props.size || 82;
  const color = props.color || '#D9D9D9';

  return (
    <Svg
      width={size}
      height={(size * 88) / 82}
      viewBox="0 0 82 88"
      fill="none"
      {...props}
    >
      <Path
        fill={color}
        d="M17.92 87.59c-2.385 0-4.462-.729-6.232-2.189-1.77-1.46-2.77-3.321-3-5.584l-8.655-75c-.154-1.313.23-2.445 1.154-3.394C2.11.474 3.264 0 4.649 0h72.702c1.385 0 2.539.474 3.462 1.423.923.95 1.308 2.08 1.154 3.394l-8.655 75c-.23 2.263-1.23 4.124-3 5.584s-3.847 2.19-6.232 2.19H17.92ZM9.727 8.76l6.116 52.554h50.314l6.001-52.555H9.727Z"
      />
      <Circle cx={49.076} cy={53.424} r={13.046} fill={color} />
    </Svg>
  );
};

export default BeerPongCupIcon;
