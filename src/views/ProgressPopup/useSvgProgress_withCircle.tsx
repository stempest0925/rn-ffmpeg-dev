import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

interface SvgProgressProps {
  progress: number;
  size: number;
  strokeWidth: number;
}

function SvgProgress(props: SvgProgressProps) {
  const animatedProgress = useSharedValue(0);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const svgSize = props.size + props.strokeWidth;
  const svgPadding = Math.floor(props.strokeWidth / 2);
  const circleRadius = Math.floor(props.size / 2);
  const circleAxis: [number, number] = [circleRadius + svgPadding, circleRadius + svgPadding];

  const strokeDasharray = Math.floor(Math.PI * 2 * circleRadius); //周长 2πr
  const strokeDashoffset = Math.floor(((100 - props.progress) / 100) * strokeDasharray); //实长
  animatedProgress.value = withTiming(strokeDashoffset);

  return (
    <View style={[styles.container, { width: svgSize, height: svgSize }]}>
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
          strokeDashoffset={animatedProgress}
        />
      </Svg>
      <Text style={styles.text}>{props.progress}%</Text>
    </View>
  );
}

export default SvgProgress;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    transform: [{ rotate: "-90deg" }],
  },
  text: {
    color: "green",
    fontSize: 32,
    fontWeight: "bold",
  },
});

/**
 * 【开发问题】
 * 1. Circle transform rotate无效。
 * 2. Text没有找到好的方案居中，因此用了RN Text。
 */
