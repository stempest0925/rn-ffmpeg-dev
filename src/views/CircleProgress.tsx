import React from 'react';
import Svg, {Circle, Path, Text} from 'react-native-svg';

interface CircleProgressProps {
  progress: number;
}

function CircleProgress(props: CircleProgressProps) {
  const svgWidth = 250,
    svgHeight = 250;

  function transAngle(angle: number) {
    return angle * (Math.PI / 180);
  }
  const originRadius = Math.floor(svgWidth / 2);

  const strokeWidth = 12;

  const circleAxis = originRadius;
  const circleSize = originRadius;

  const radius = originRadius;
  const angle = Math.floor((props.progress / 100) * 360);
  console.log('angle', angle);

  const startAxis = `M${radius} 0`;
  const progressX = Math.round(radius + Math.sin(transAngle(angle)) * radius);
  const progressY = Math.round(radius - Math.cos(transAngle(angle)) * radius);
  const endAxis = `A${radius} ${radius} 0 ${angle > 180 && angle < 360 ? '1' : '0'} 1 ${progressX} ${progressY}`;

  return (
    <Svg width={svgWidth} height={svgHeight}>
      <Circle cx={circleAxis} cy={circleAxis} r={circleSize} fill="#fff" strokeWidth={strokeWidth} stroke="#ccc" />
      <Path d={startAxis + ' ' + endAxis} fill="none" stroke="green" strokeWidth={12} />
      <Text x={radius} y={radius} fill="green" fontSize="32" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
        {props.progress}%
      </Text>
    </Svg>
  );
}

export default CircleProgress;
