import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import Video from 'react-native-video';
import {VIDEO_HEIGHT} from '../constants/video';

FFmpegKitConfig.disableLogs();

interface VideoProps {
  uri: string | null;
}

export default function VideoView(props: VideoProps): JSX.Element {
  return (
    <View style={styles.videoContainer}>
      {props.uri && <Video source={{uri: props.uri}} resizeMode="contain" style={styles.backgroundVideo} />}
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#333',
    position: 'relative',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
