import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Video, {type OnProgressData} from 'react-native-video';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {VIDEO_HEIGHT} from '../constants/video';

interface VideoProps {
  uri: string | null;
}

export default function VideoView(props: VideoProps): JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);
  const [playTime, setPlayTime] = useState<[string, string]>(['00:00', '00:00']);

  const onVideoProgress = (data: OnProgressData) => {
    setPlayTime([timeFormat(data.currentTime), timeFormat(data.seekableDuration)]);
    console.log(timeFormat(data.currentTime), timeFormat(data.playableDuration), timeFormat(data.seekableDuration));
  };

  const timeFormat = (time: number) => {
    const fn = (num: number) => {
      return num < 10 ? '0' + num : num;
    };
    const minutes = Math.floor(time / 60),
      seconds = Math.floor(time % 60);

    return fn(minutes) + ':' + fn(seconds);
  };

  const controlAnimatedStyle = useAnimatedStyle(() => ({bottom: visible ? 0 : -30}), [visible]);
  const moveGesture = Gesture.Pan()
    .onStart(event => {
      // console.log('pan start', event);
    })
    .onUpdate(() => {
      console.log('onUpdate');
    })
    .onEnd(event => {
      let tiggerDirection: 'translationX' | 'translationY' | null = null;
      tiggerDirection = Math.abs(event.translationX) > Math.abs(event.translationY) ? 'translationX' : 'translationY';
      console.log(event[tiggerDirection] > 0 ? 'right' : 'left');
      // console.log('pan end', event);
    });

  return (
    <View style={styles.videoContainer}>
      {props.uri && (
        <Video source={{uri: props.uri}} resizeMode="cover" style={styles.backgroundVideo} onProgress={onVideoProgress} />
      )}
      <GestureDetector gesture={moveGesture}>
        <View style={styles.controlContainer}>
          <Animated.View style={[styles.bottomMenu, controlAnimatedStyle]}>
            <Text style={styles.playTime} adjustsFontSizeToFit={true}>
              {playTime[0]}
            </Text>
            <View style={styles.progressBar}></View>
            <Text style={styles.playTime} adjustsFontSizeToFit={true}>
              {playTime[1]}
            </Text>
          </Animated.View>
        </View>
      </GestureDetector>
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
  controlContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  bottomMenu: {
    width: '100%',
    height: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  playTime: {
    width: 42,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  progressBar: {
    flex: 1,
    height: 3,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
  },
});
