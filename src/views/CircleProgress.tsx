import React from 'react';
import Svg, {Path, Text} from 'react-native-svg';

interface CircleProgressProps {
  progress: number;
}

function CircleProgress(props: CircleProgressProps) {
  const svgWidth = 300,
    svgHeight = 300;

  function transAngle(angle: number) {
    return angle * (Math.PI / 180);
  }

  const radius = Math.floor(svgWidth / 2);
  const angle = Math.floor((props.progress / 100) * 360);
  console.log('angle', angle);

  const startAxis = `M${radius} 0`;
  const progressX = Math.round(radius + Math.sin(transAngle(angle)) * radius);
  const progressY = Math.round(radius - Math.cos(transAngle(angle)) * radius);
  const endAxis = `A${radius} ${radius} 0 ${angle > 180 && angle < 360 ? '1' : '0'} 1 ${progressX} ${progressY}`;

  const startAxis2 = `M${radius} 0`;
  const endAxis2 = `A${radius} ${radius} 0 1 1 ${radius - 1} 0`;

  console.log(startAxis + ' ' + endAxis);
  return (
    <Svg width={svgWidth} height={svgHeight}>
      <Path d={startAxis + ' ' + endAxis} fill="none" stroke="red" strokeWidth={5} />
      <Path d={startAxis2 + ' ' + endAxis2} fill="none" stroke="#ccc" strokeWidth={5} />
      <Text stroke="purple" fontSize="20" fontWeight="bold" x="100" y="20" textAnchor="middle">
        {props.progress}%
      </Text>
    </Svg>
  );
}

export default CircleProgress;
