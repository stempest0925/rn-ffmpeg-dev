import React, { useRef } from "react";
import { StyleSheet, View, Text, ScrollView, Image, Platform } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { throttle } from "../helpers/optimize";

interface TimeAxiosProps {
  thumbnailList: string[] | null;
}

function TimeAxios(props: TimeAxiosProps): JSX.Element {
  return (
    <View style={styles.container}>
      {props.thumbnailList &&
        props.thumbnailList.map((filepath, index) => (
          <Image key={index} source={{ uri: filepath }} style={styles.thumbnail} />
        ))}
    </View>
  );
}

export default TimeAxios;
const styles = StyleSheet.create({
  container: {
    marginVertical: 36,
    paddingHorizontal: 24,
    flexDirection: "row",
    position: "relative",
  },
  thumbnail: {
    flex: 1,
    height: 36,
  },
});
