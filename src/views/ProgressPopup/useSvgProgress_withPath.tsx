import React from "react";
import Svg, { Circle, Path, Text } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedProps, withTiming } from "react-native-reanimated";

interface SvgProgressProps {
  size: number;
  strokeWidth: number;
}

function useSvgProgress(props: SvgProgressProps) {
  const animatedAngle = useSharedValue(0);
  const AnimatedPath = Animated.createAnimatedComponent(Path);

  const svgSize = props.size;
  const originRadius = Math.floor(props.size / 2);
  const circleAxis = [originRadius, originRadius];
  const circleSize = originRadius;

  const toggleProgress = (_progress: number) => {
    const angle = Math.floor((_progress / 100) * 360);

    animatedAngle.value = withTiming(angle);
  };

  const animatedPathProps = useAnimatedProps(() => {
    const moveAxis = `M${circleAxis[0]} 0`;
    const arcX = originRadius + Math.sin(animatedAngle.value * (Math.PI / 180)) * originRadius;
    const arcY = originRadius - Math.cos(animatedAngle.value * (Math.PI / 180)) * originRadius;
    const arcLarge = animatedAngle.value > 180 && animatedAngle.value <= 360 ? 1 : 0;
    const arcAxis = `A${originRadius} ${originRadius} 0 ${arcLarge} 1 ${arcX} ${arcY}`;
    const path = `${moveAxis} ${arcAxis}`;

    return { d: path };
  });

  const SvgProgressRender = () => (
    <Svg width={svgSize} height={svgSize}>
      <Circle
        cx={circleAxis[0]}
        cy={circleAxis[1]}
        r={circleSize}
        fill="none"
        stroke="#ccc"
        strokeWidth={props.strokeWidth}
      />
      <AnimatedPath
        animatedProps={animatedPathProps}
        fill="none"
        stroke="green"
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
      />
      <Text x={circleAxis[0]} y={circleAxis[1]} fill="green" fontSize="32" fontWeight="bold">
        66
      </Text>
    </Svg>
  );

  return { SvgProgressRender, toggleProgress };
}

export default useSvgProgress;
/**
 * 【开发问题】
 * 1. 绘制到原点，则会从头开始，无法绘制全圆。
 */
