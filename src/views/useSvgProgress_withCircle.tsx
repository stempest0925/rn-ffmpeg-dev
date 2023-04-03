import React, {useState} from 'react';
import Svg, {Circle, Text} from 'react-native-svg';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';

interface SvgProgressProps {
  size: number;
  strokeWidth: number;
}

function useSvgProgress(props: SvgProgressProps) {
  const animatedValue = useSharedValue(0);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const [progress, setProgress] = useState(0);

  const svgSize = props.size + props.strokeWidth;
  const strokePadding = Math.floor(props.strokeWidth / 2);
  const originRadius = Math.floor(props.size / 2);
  const circleAxis: [number, number] = [originRadius + strokePadding, originRadius + strokePadding];
  const circleSize = originRadius;

  const strokeDasharray = Math.floor(Math.PI * 2 * originRadius); //周长 2πr
  const toggleProgress = (_progress: number) => {
    setProgress(_progress);
    const strokeDashoffset = Math.floor(((100 - _progress) / 100) * strokeDasharray); //实长
    animatedValue.value = withTiming(strokeDashoffset, {duration: 600});
  };

  const SvgProgressRender = () => (
    <Svg width={svgSize} height={svgSize} transform={[{rotate: '-90deg'}]}>
      <Circle
        cx={circleAxis[0]}
        cy={circleAxis[1]}
        r={circleSize}
        fill="transparent"
        stroke="#ccc"
        strokeWidth={props.strokeWidth}
      />
      <AnimatedCircle
        cx={circleAxis[0]}
        cy={circleAxis[1]}
        r={circleSize}
        fill="transparent"
        stroke="green"
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={animatedValue}
      />

      <Text x={circleAxis[0]} y={circleAxis[1]} fill="green" fontSize="32" fontWeight="bold">
        {progress}%
      </Text>
    </Svg>
  );

  return {SvgProgressRender, toggleProgress};
}

export default useSvgProgress;
/**
 * 【开发问题】
 * 1. Circle transform rotate无效
 */
