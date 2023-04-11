import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import Video, {type OnProgressData, type OnLoadData} from 'react-native-video';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {VIDEO_HEIGHT} from '../constants/video';
import {timeFormat} from '../helpers/utils';
// import {throttle} from '../helpers/optimize';

interface VideoProps {
  uri: string | null;
}

export default function VideoPlayer(props: VideoProps): JSX.Element {
  // Ref
  const videoRef = useRef<Video | null>(null);
  // with control
  const [visible, setVisible] = useState<boolean>(true);
  const bottomMenuAnimated = useSharedValue(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [playTime, setPlayTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // with seek
  const [seekVisible, setSeekVisible] = useState<boolean>(false);
  const [startSeekTime, setStartSeekTime] = useState<number>(0);
  const [seekTime, setSeekTime] = useState<number>(0);

  // 生命周期
  const onVideoLoad = (data: OnLoadData) => {
    console.log('video loaded', data.currentTime, data.duration);

    setPlayTime(data.currentTime);
    setDuration(data.duration);
  };
  const onVideoPlayProgress = (data: OnProgressData) => {
    console.log('video play progress', data.currentTime);

    setPlayTime(data.currentTime);
  };
  const onVideoPlayEnd = () => {
    console.log('video play end');

    setPlayTime(duration);
  };

  // 手势
  const singleTapGesture = Gesture.Tap()
    .onEnd(() => {
      console.log('single click');

      setVisible(!visible);
      bottomMenuAnimated.value = withTiming(!visible ? 30 : 0);
    })
    .runOnJS(true);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      console.log('double click');

      setPaused(!paused);
    })
    .runOnJS(true);

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      console.log('pan start', playTime);

      setPaused(true);
      setStartSeekTime(playTime);
      setSeekVisible(true);
    })
    .onChange(event => {
      if (event.translationX === 0 && event.translationY === 0) return;

      const time = countSeekTime(event.translationX, event.translationY);
      setSeekTime(time);

      console.log('pan change', time);
    })
    .onEnd(() => {
      console.log('pan end', seekTime);

      videoRef.current?.seek(seekTime);
      setSeekVisible(false);
      setPlayTime(seekTime);
      setPaused(false);
    })
    .runOnJS(true);

  const composedGesture = Gesture.Race(Gesture.Exclusive(doubleTapGesture, singleTapGesture), dragGesture);

  // 计算拖拽时间
  const countSeekTime = (translationX: number, translationY: number, factor: number = 0.5) => {
    const dragX = Math.round(translationX),
      dragY = Math.round(translationY);

    const isXOrY = Math.abs(dragX) > Math.abs(dragY) ? 'X' : 'Y';
    if (isXOrY === 'X') {
      const dragRatio = Number((Math.abs(dragX) / Dimensions.get('window').width).toFixed(2));
      const dragSeconds = Math.round(duration * dragRatio * factor);

      const finalTime = dragX < 0 ? Math.max(startSeekTime - dragSeconds, 0) : Math.min(startSeekTime + dragSeconds, duration);

      return finalTime;
    } else {
      return 60;
    }
  };

  // 动画
  const controlAnimatedStyle = useAnimatedStyle(() => ({transform: [{translateY: bottomMenuAnimated.value}]}));

  // 进度
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
          paused={paused}
          resizeMode="contain"
          style={styles.backgroundVideo}
          progressUpdateInterval={1000}
          onLoad={onVideoLoad}
          onProgress={onVideoPlayProgress}
          onEnd={onVideoPlayEnd}
        />
      )}
      <GestureDetector gesture={composedGesture}>
        <View style={styles.controlContainer}>
          {seekVisible && (
            <View style={styles.dragTimeBox}>
              <Text style={styles.dragText}>{timeFormat(seekTime)}</Text>
              <Text style={styles.dragLine}>|</Text>
              <Text style={styles.dragText}>{timeFormat(duration)}</Text>
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
  dragTimeBox: {
    padding: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 6,
  },
  dragText: {
    color: '#fff',
    fontSize: 16,
  },
  dragLine: {
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
