import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';

interface SvgProgressProps {
  size: number;
  strokeWidth: number;
}

function useSvgProgress(props: SvgProgressProps) {
  const [progress, setProgress] = useState(0);
  const animatedValue = useSharedValue(0);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const svgSize = props.size + props.strokeWidth;
  const svgPadding = Math.floor(props.strokeWidth / 2);
  const circleRadius = Math.floor(props.size / 2);
  const circleAxis: [number, number] = [circleRadius + svgPadding, circleRadius + svgPadding];

  const strokeDasharray = Math.floor(Math.PI * 2 * circleRadius); //周长 2πr
  const toggleProgress = (_progress: number) => {
    setProgress(_progress);
    const strokeDashoffset = Math.floor(((100 - _progress) / 100) * strokeDasharray); //实长
    animatedValue.value = withTiming(strokeDashoffset);
  };

  const SvgProgressRender = () => (
    <View style={[styles.container, {width: svgSize, height: svgSize}]}>
      <Svg width={svgSize} height={svgSize} style={styles.svg}>
        <Circle
          cx={circleAxis[0]}
          cy={circleAxis[1]}
          r={circleRadius}
          fill="none"
          stroke="#ccc"
          strokeWidth={props.strokeWidth}
        />
        <AnimatedCircle
          cx={circleAxis[0]}
          cy={circleAxis[1]}
          r={circleRadius}
          fill="none"
          stroke="green"
          strokeLinecap="round"
          strokeWidth={props.strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={animatedValue}
        />
      </Svg>
      <Text style={styles.text}>{progress}%</Text>
    </View>
  );

  return {SvgProgressRender, toggleProgress};
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{rotate: '-90deg'}],
  },
  text: {
    color: 'green',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default useSvgProgress;
/**
 * 【开发问题】
 * 1. Circle transform rotate无效。
 * 2. Text没有找到好的方案居中，因此用了RN Text。
 */
