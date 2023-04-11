import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Video, { type OnProgressData, type OnLoadData } from "react-native-video";
import { VIDEO_HEIGHT } from "../../constants/video";
import Controller from "./Controller";

interface VideoProps {
  uri: string | null;
  poster: string | null;
}

export default function VideoPlayer(props: VideoProps): JSX.Element {
  // Ref
  const videoRef = useRef<Video | null>(null);
  // with control
  const [paused, setPaused] = useState<boolean>(false);
  const [playTime, setPlayTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [volume, setVolume] = useState<number>(80);

  // 生命周期
  const onVideoStart = () => {};
  const onVideoLoad = (data: OnLoadData) => {
    console.log("video loaded", data.currentTime, data.duration);

    setPlayTime(data.currentTime);
    setDuration(data.duration);
  };
  const onVideoError = () => {};
  const onVideoPlayProgress = (data: OnProgressData) => {
    console.log("video play progress", data.currentTime);

    setPlayTime(data.currentTime);
  };
  const onVideoPlayEnd = () => {
    console.log("video play end");

    setPlayTime(duration);
  };
  const onVideoSought = () => {
    setPaused(false);
  };

  const seekTo = (seconds: number) => {
    setPaused(true);
    videoRef.current?.seek(seconds);
  };
  const doubleTap = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.videoContainer}>
      {props.uri && (
        <Video
          source={{ uri: props.uri }}
          ref={ref => (videoRef.current = ref)}
          paused={paused}
          volume={volume}
          resizeMode="contain"
          poster={props.uri}
          style={styles.backgroundVideo}
          progressUpdateInterval={1000} //300
          onLoadStart={onVideoStart}
          onLoad={onVideoLoad}
          onError={onVideoError}
          onProgress={onVideoPlayProgress}
          onEnd={onVideoPlayEnd}
          onSeek={onVideoSought}
        />
      )}
      <Controller currentTime={playTime} duration={duration} onSeekTo={seekTo} onDoubleTap={doubleTap} />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    height: VIDEO_HEIGHT,
    backgroundColor: "#333",
    position: "relative",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controlContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },

  bottomMenu: {
    width: "100%",
    height: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  playTime: {
    width: 42,
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    textAlign: "center",
  },
  progressTrack: {
    flex: 1,
    height: 3,
    marginHorizontal: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 3,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 3,
  },
});
