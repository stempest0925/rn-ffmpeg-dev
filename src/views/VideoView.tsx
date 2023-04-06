import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Video, {type OnProgressData, type OnLoadData} from 'react-native-video';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {VIDEO_HEIGHT} from '../constants/video';
import {timeFormat} from '../helpers/utils';

interface VideoProps {
  uri: string | null;
}

export default function VideoView(props: VideoProps): JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);
  const [playTime, setPlayTime] = useState<[number, number]>([0, 0]);

  const [moveVisible, setMoveVisible] = useState<boolean>(false);
  const [moveTime, setMoveTime] = useState<[number, number]>([0, 0]);

  const onVideoProgress = (data: OnProgressData) => {
    setPlayTime([data.currentTime, data.seekableDuration]);
  };
  const onVideoLoad = (data: OnLoadData) => {
    setPlayTime([data.currentTime, data.duration]);
    setMoveTime([data.currentTime, data.duration]);
  };

  const controlAnimatedStyle = useAnimatedStyle(() => ({bottom: visible ? 0 : -30}), [visible]);
  const moveGesture = Gesture.Pan()
    .onStart(event => {
      console.log('onStart');
      setMoveVisible(true);
    })
    .onUpdate(event => {
      // let tiggerDirection: 'translationX' | 'translationY' | null = null;
      // tiggerDirection = Math.abs(event.translationX) > Math.abs(event.translationY) ? 'translationX' : 'translationY';
      // console.log(event[tiggerDirection] > 0 ? 'right' : 'left');
    })
    .onEnd(event => {
      console.log('onEnd');
      setMoveVisible(false);
    })
    .runOnJS(true);

  const RenderMoveTimeBox = () => {
    if (moveVisible) {
      return (
        <View style={styles.moveTimeBox}>
          <Text style={styles.moveText}>{timeFormat(moveTime[0])}</Text>
          <Text style={styles.moveLine}>|</Text>
          <Text style={styles.moveText}>{timeFormat(moveTime[1])}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.videoContainer}>
      {props.uri && (
        <Video
          source={{uri: props.uri}}
          resizeMode="cover"
          style={styles.backgroundVideo}
          onProgress={onVideoProgress}
          onLoad={onVideoLoad}
        />
      )}
      <GestureDetector gesture={moveGesture}>
        <View style={styles.controlContainer}>
          <RenderMoveTimeBox />
          <Animated.View style={[styles.bottomMenu, controlAnimatedStyle]}>
            <Text style={styles.playTime} adjustsFontSizeToFit={true}>
              {timeFormat(playTime[0])}
            </Text>
            <View style={styles.progressBar}></View>
            <Text style={styles.playTime} adjustsFontSizeToFit={true}>
              {timeFormat(playTime[1])}
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
  progressBar: {
    flex: 1,
    height: 3,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
  },
});
