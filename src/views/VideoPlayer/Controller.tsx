import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";

import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ProgressBar from "./ProgressBar";
import SeekToast from "./SeekToast";
import VolumeToast from "./VolumeToast";
import { timeFormat } from "../../helpers/utils";

interface ControllerProps {
  currentTime: number;
  duration: number;
  onSeekTo: (seconds: number) => void;
  onDoubleTap: () => void;
}
type DragDataType = {
  first: boolean;
  direction?: "x" | "y";
  startSeekTime?: number;
  seekTime?: number;
};
type countDargDataReturn = {
  direction: "x" | "y";
  isNegative: boolean;
  ratio: number;
};

export default function Controller(props: ControllerProps): JSX.Element {
  const dragDataRef = useRef<DragDataType>({ first: true });

  const [visible, setVisible] = useState<boolean>(false);
  const bottomMenuStyle = useAnimatedStyle(() => ({ bottom: withTiming(visible ? 0 : "-100%") }));

  const { SeekToastRender, setSeekTime, openSeekToast, closeSeekToast } = SeekToast({ duration: props.duration });
  const { VolumeToastRender, openVolumeToast, closeVolumeToast } = VolumeToast({ volume: 80 });

  // 返回方向、正负、拖拽比例
  const countDargData = (translationX: number, translationY: number): countDargDataReturn => {
    const dragX = Math.round(translationX),
      dragY = Math.round(translationY);

    const direction = Math.abs(dragX) > Math.abs(dragY) ? "x" : "y";
    const isNegative = direction === "x" ? dragX < 0 : dragY < 0;
    const ratio = (() => {
      const { width, height } = Dimensions.get("window");
      const calculateParams = {
        x: { dragDistance: dragX, visibleSize: width },
        y: { dragDistance: dragY, visibleSize: height },
      };
      return Number(
        (Math.abs(calculateParams[direction].dragDistance) / calculateParams[direction].visibleSize).toFixed(2),
      );
    })();

    return { direction, isNegative, ratio };
  };

  // gestures
  const singleTapGesture = Gesture.Tap()
    .onEnd(() => setVisible(!visible))
    .runOnJS(true);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => props.onDoubleTap())
    .runOnJS(true);

  const dragGesture = Gesture.Pan()
    .hitSlop({ horizontal: -32 })
    .onStart(() => {
      dragDataRef.current = { first: true };
    })
    .onChange(event => {
      if (event.translationX === 0 && event.translationY === 0) return;

      const dargData = countDargData(event.translationX, event.translationY);
      const executeFn = {
        x: () => {
          if (dragDataRef.current.first) {
            dragDataRef.current = { first: false, direction: dargData.direction, startSeekTime: props.currentTime };
            openSeekToast();
          }
          const factor = 0.5; //系数
          const seconds = Math.round(props.duration * dargData.ratio * factor);
          const startTime = dragDataRef.current.startSeekTime || 0;
          // 必须在min/max中完成小数计算，以免后续保留小数超出范围
          const finalSeconds = dargData.isNegative
            ? Math.max(Number((startTime - seconds).toFixed(2)), 0)
            : Math.min(Number((startTime + seconds).toFixed(2)), props.duration);

          // do seek something
          setSeekTime(finalSeconds);
          dragDataRef.current.seekTime = finalSeconds;
        },
        y: () => {
          if (dragDataRef.current.first) {
            dragDataRef.current = { first: false, direction: dargData.direction };
            openVolumeToast();
          }
          // do volume something
        },
      };
      executeFn[dargData.direction]();
    })
    .onEnd(() => {
      const direction = dragDataRef.current.direction;
      if (direction) {
        const executeFn = {
          x: () => {
            const seekTime = dragDataRef.current.seekTime;
            seekTime && props.onSeekTo(seekTime);
            closeSeekToast();
          },
          y: () => {
            closeVolumeToast();
          },
        };
        executeFn[direction]();
      }
    })
    .runOnJS(true);

  const composedGesture = Gesture.Race(Gesture.Exclusive(doubleTapGesture, singleTapGesture), dragGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={styles.controller}>
        <SeekToastRender />
        <VolumeToastRender />
        <Animated.View style={[styles.bottomMenu, bottomMenuStyle]}>
          <Text style={styles.timeText} adjustsFontSizeToFit={true}>
            {timeFormat(props.currentTime)}
          </Text>
          <ProgressBar currentTime={props.currentTime} duration={props.duration} onSeekTo={props.onSeekTo} />
          <Text style={styles.timeText} adjustsFontSizeToFit={true}>
            {timeFormat(props.duration)}
          </Text>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  controller: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },

  bottomMenu: {
    width: "100%",
    paddingHorizontal: 12,
    // paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  timeText: {
    width: 42,
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    textAlign: "center",
  },
});
