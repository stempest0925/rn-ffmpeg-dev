import React, {useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import Video, {type OnProgressData, type OnLoadData} from 'react-native-video';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  type GestureUpdateEvent,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {VIDEO_HEIGHT} from '../constants/video';
import {timeFormat} from '../helpers/utils';
import {throttle} from '../helpers/optimize';

interface VideoProps {
  uri: string | null;
}
export default function VideoView(props: VideoProps): JSX.Element {
  const [visible, setVisible] = useState<boolean>(true);
  const videoRef = useRef<Video | null>(null);
  const [playTime, setPlayTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [moveVisible, setMoveVisible] = useState<boolean>(false);
  const [moveTime, setMoveTime] = useState<number>(0);

  const onVideoProgress = (data: OnProgressData) => {
    setPlayTime(data.currentTime);
  };

  const onVideoLoad = (data: OnLoadData) => {
    setPlayTime(data.currentTime);
    setDuration(data.duration);
  };

  const controlAnimatedStyle = useAnimatedStyle(() => ({bottom: visible ? 0 : -30}), [visible]);
  const moveGesture = Gesture.Pan()
    .onStart(() => {
      console.log('pan start');

      setMoveVisible(true);
      setMoveTime(playTime);
    })
    .onUpdate(
      throttle((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        const time = countMoveSeconds(event.translationX, event.translationY);
        setMoveTime(time);
      }, 100),
    )
    .onEnd(event => {
      console.log('pan end');

      const time = countMoveSeconds(event.translationX, event.translationY);
      setMoveTime(time);
      setPlayTime(time);
      videoRef.current?.seek(time);
      setMoveVisible(false);
    })
    .runOnJS(true);

  const countMoveSeconds = (translationX: number, translationY: number) => {
    const isXOrY = Math.abs(translationX) > Math.abs(translationY) ? 'translationX' : 'translationY';
    if (isXOrY === 'translationX') {
      const direction = translationX > 0 ? 'right' : 'left';
      const moveRatio = Math.abs(translationX) / Dimensions.get('window').width;
      const moveSeconds = Math.floor(duration * moveRatio);
      console.log(moveRatio, moveSeconds);

      const finalTime = direction === 'left' ? Math.max(playTime - moveSeconds, 0) : Math.min(playTime + moveSeconds, duration);
      return finalTime;
    } else {
      return 0;
    }
  };

  const progress = useMemo(() => {
    if (playTime <= 0) return 0;
    return Math.ceil((playTime / duration) * 100);
  }, [playTime, duration]);

  return (
    <View style={styles.videoContainer}>
      {props.uri && (
        <Video
          source={{uri: props.uri}}
          ref={ref => (videoRef.current = ref)}
          resizeMode="contain"
          style={styles.backgroundVideo}
          progressUpdateInterval={1000}
          onProgress={onVideoProgress}
          onLoad={onVideoLoad}
        />
      )}
      <GestureDetector gesture={moveGesture}>
        <View style={styles.controlContainer}>
          {moveVisible && (
            <View style={styles.moveTimeBox}>
              <Text style={styles.moveText}>{timeFormat(moveTime)}</Text>
              <Text style={styles.moveLine}>|</Text>
              <Text style={styles.moveText}>{timeFormat(duration)}</Text>
            </View>
          )}
          <Animated.View style={[styles.bottomMenu, controlAnimatedStyle]}>
            <Text style={styles.playTime} adjustsFontSizeToFit={true}>
              {timeFormat(playTime)}
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, {width: `${progress}%`}]}></View>
            </View>
            <Text style={styles.playTime} adjustsFontSizeToFit={true}>
              {timeFormat(duration)}
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
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  moveTimeBox: {
    padding: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 6,
  },
  moveText: {
    color: '#fff',
    fontSize: 16,
  },
  moveLine: {
    marginHorizontal: 5,
    color: '#fff',
    fontSize: 16,
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
  progressTrack: {
    flex: 1,
    height: 3,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 3,
  },
});
