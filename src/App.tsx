import React, { useReducer } from "react";
import { StyleSheet, View } from "react-native";
import { FFmpegKitConfig } from "ffmpeg-kit-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initialState, reducer } from "./views/reducer";

FFmpegKitConfig.disableLogs();

// children
import VideoView from "./views/VideoPlayer";
import TimeAxios from "./views/TimeAxios";
import Controller from "./views/Controller";
// action
import { SetThumbnailList, setVideoUri } from "./views/action";

export default function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <VideoView uri={state.uri} poster="https://stempest0925.github.io/static/media/banner-cover.47f71d48.jpg" />
        <TimeAxios thumbnailList={state.thumbnailList} />
      </View>
      <Controller
        setVideoUri={(uri: string) => dispatch(setVideoUri(uri))}
        setThumbnailList={(list: string[]) => dispatch(SetThumbnailList(list))}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
