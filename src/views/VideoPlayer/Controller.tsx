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

export default function Controller(props: ControllerProps): JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);
  const touchAxisSizeRef = useRef<{ x: number; y: number } | null>(null);
  const dragDataRef = useRef<{ first: boolean; direction: "x" | "y" | null }>({ first: true, direction: null });

  const { SeekToastRender, setSeekTime, openSeekToast, closeSeekToast } = SeekToast({ duration: props.duration });
  const { VolumeToastRender, openVolumeToast, closeVolumeToast } = VolumeToast({ volume: 80 });

  const bottomMenuStyle = useAnimatedStyle(() => ({ bottom: withTiming(visible ? 0 : "-100%") }));

  // 返回方向、正负、拖拽比例
  const countDargData = (params: {
    translationX: number;
    translationY: number;
    x: number;
    y: number;
  }):
    | {
        direction: "x" | "y";
        isNegative: boolean;
        ratio: number;
      }
    | undefined => {
    if (touchAxisSizeRef.current) {
      const dragX = Math.round(params.translationX),
        dragY = Math.round(params.translationY);

      const direction = Math.abs(dragX) > Math.abs(dragY) ? "x" : "y";
      const isNegative = direction === "x" ? dragX < 0 : dragY < 0;
      const ratio = Number((Math.abs(params[direction]) / touchAxisSizeRef.current[direction]).toFixed(2));

      return { direction, isNegative, ratio };
    }
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
    .onStart(() => {
      // 初始化数据
      dragDataRef.current = { first: true, direction: null };
      console.log("】】】】】】】】】】】】dragDataRef.current", dragDataRef.current);
    })
    .onChange(event => {
      const dargData = countDargData({
        translationX: event.translationX,
        translationY: event.translationY,
        x: event.x,
        y: event.y,
      });

      if (dargData) {
        dragDataRef.current.direction = dargData.direction;
        if (dargData.direction === "x") {
          console.log("【【【【【【【【【dragDataRef.current.first", dragDataRef.current.first);
          if (dragDataRef.current.first) {
            dragDataRef.current.first = false;
            console.log("---------------openSeekToast");
            openSeekToast();
          }

          const factor = 0.5; //系数
          const seconds = Math.round(props.duration * dargData.ratio * factor);
          const finalSeconds = dargData.isNegative
            ? Math.max(props.currentTime - seconds, 0)
            : Math.min(props.currentTime + seconds, props.duration);
          console.log("finalSeconds", finalSeconds);

          // setSeekTime(finalSeconds);
        } else {
          if (dragDataRef.current.first) {
            dragDataRef.current.first = false;
            openVolumeToast();
          }
          // do volume something
        }
      }
    })
    .onEnd(() => {
      if (dragDataRef.current.direction === "x") {
        closeSeekToast();
      } else {
        closeVolumeToast();
      }
    })
    .runOnJS(true);
  const composedGesture = Gesture.Race(Gesture.Exclusive(doubleTapGesture, singleTapGesture), dragGesture);

  return (
    <View style={styles.controller}>
      <GestureDetector gesture={composedGesture}>
        <View
          style={styles.touchArea}
          onLayout={e => (touchAxisSizeRef.current = { x: e.nativeEvent.layout.width, y: e.nativeEvent.layout.height })}
        />
      </GestureDetector>
      {/* <SeekToastRender /> */}
      {/* <VolumeToastRender /> */}
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

  touchArea: {
    position: "absolute",
    top: 0,
    right: "10%",
    bottom: 0,
    left: "10%",
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
