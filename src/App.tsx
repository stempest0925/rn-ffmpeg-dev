import React from "react";
import { StyleSheet, View } from "react-native";
import { FFmpegKitConfig } from "ffmpeg-kit-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProgressPopup from "./views/ProgressPopup";

FFmpegKitConfig.disableLogs();

// children
// import VideoView from "./views/VideoPlayer";
// import TimeAxios from "./views/TimeAxios";
import Controller from "./views/Controller";

export default function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* <VideoView uri={state.uri} poster="https://stempest0925.github.io/static/media/banner-cover.47f71d48.jpg" /> */}
        {/* <TimeAxios thumbnailList={{}} /> */}
      </View>
      <Controller />
      <ProgressPopup />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
