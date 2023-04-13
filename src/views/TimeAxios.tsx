import React, { useRef } from "react";
import { StyleSheet, View, Text, ScrollView, Image, Platform } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { throttle } from "../helpers/optimize";

// lucas lib 可以加上节流、防抖、取范围区间数据（max、min整合）

interface TimeAxiosProps {
  thumbnailList: string[] | null;
}

function TimeAxios(props: TimeAxiosProps): JSX.Element {
  // const dargDataRef = useRef<{ startX: number }>();
  const dargDataRef = useRef<{ dargCount: number }>({ dargCount: 0 });
  const scrollRef = useRef<ScrollView | null>(null);
  const scrollDataRef = useRef<{ fullSize: number; size: number; offset: number }>();
  const dargGeture = Gesture.Pan()
    .hitSlop(20)
    .onStart(e => {
      console.log(scrollDataRef.current?.offset);
      // console.log(scrollDataRef.current?.offset.x);
    })
    .onChange(
      throttle(e => {
        if (scrollDataRef.current) {
          dargDataRef.current.dargCount = dargDataRef.current.dargCount + 1;
          let transX = scrollDataRef.current.offset + dargDataRef.current.dargCount * 0.5;

          // let transX = scrollDataRef.current.offset + e.translationX;
          transX = Math.min(transX, scrollDataRef.current.fullSize - scrollDataRef.current.size);
          transX = Math.max(transX, 0);
          console.log(transX);

          //这里单纯按照更新，会拖动太快，准备使用节流，累加进行拖动
          scrollRef.current?.scrollTo({ x: transX, animated: false });
        }
      }, 16),
    )
    .runOnJS(true);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        ref={ref => (scrollRef.current = ref)}
        onScroll={e => {
          // e.preventDefault();
          scrollDataRef.current = {
            offset: e.nativeEvent.contentOffset.x,
            size: e.nativeEvent.layoutMeasurement.width,
            fullSize: e.nativeEvent.contentSize.width,
          };
        }}
        onLayout={e => {
          console.log(e.nativeEvent);
        }}>
        {/* {props.thumbnailList &&
          props.thumbnailList.map((filepath, index) => (
            <Image key={index} source={{ uri: filepath }} style={styles.thumbnail} />
          ))} */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(item => (
          <View style={styles.bg} key={item}>
            <Text>{item}</Text>
          </View>
        ))}
        <View style={styles.cutContainer}>
          <View style={styles.cutMask} />
          <View style={styles.cutArea}>
            <GestureDetector gesture={dargGeture}>
              <View style={styles.cutDrag}></View>
            </GestureDetector>
            <View style={styles.cutDrag}></View>
          </View>
          <View style={styles.cutMask} />
        </View>
      </ScrollView>
    </View>
  );
}

export default TimeAxios;

const styles = StyleSheet.create({
  container: {
    marginVertical: 36,
    paddingLeft: 24,
  },
  thumbnail: {
    width: 74,
    height: 42,
  },
  bg: {
    width: 74,
    height: 42,
    backgroundColor: "blue",
  },

  cutContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    position: "absolute",
    left: 0,
    top: 0,
  },
  cutMask: {
    width: "12%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  cutArea: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cutDrag: {
    width: 12,
    height: "100%",
    backgroundColor: "red",
  },
});
