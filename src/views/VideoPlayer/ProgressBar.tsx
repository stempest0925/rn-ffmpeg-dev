import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeekTo: (seconds: number) => void;
}

export default function ProgressBar(props: ProgressBarProps) {
  const touchWidthRef = useRef<number | null>(null);
  const progressValue = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: progressValue.value + "%" }));

  progressValue.value = withTiming(
    (() => {
      if (props.currentTime <= 0) return 0;
      return Number(((props.currentTime / props.duration) * 100).toFixed(2));
    })(),
    { duration: 100 },
  );

  const tapGesture = Gesture.Tap()
    .onEnd(event => {
      if (touchWidthRef.current) {
        const ratio = Number((event.x / touchWidthRef.current).toFixed(2));
        const seekSeconds = Number((props.duration * ratio).toFixed(2)); //这里可以考虑用Math.max限制最大值
        /**
         * 通过video seek更新
         * 优点: 避免onProgress与seek值的跳跃差异感
         * 缺点: onProgress更新有延迟，如增加更新频率则会增加渲染次数，并且不适的更新频率会导致的进度变换不适
         */
        props.onSeekTo(seekSeconds);
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={styles.touchArea} onLayout={e => (touchWidthRef.current = e.nativeEvent.layout.width)}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    flex: 1,
    paddingVertical: 12,
  },
  progressTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 4,
  },
});
