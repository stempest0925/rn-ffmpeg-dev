import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Alert} from 'react-native';
import {requestPermission} from '../helpers/permission';

import RNFS from 'react-native-fs';
import {FFmpegKit, FFmpegSession, FFprobeKit, FFprobeSession} from 'ffmpeg-kit-react-native';
import DocumentPicker from 'react-native-document-picker';
import FFmpegCommand from '../helpers/ffmpegCommand';

const CACHE_DIR = 'file://' + RNFS.CachesDirectoryPath;

interface ControllerProps {
  setVideoUri: (uri: string) => void;
}

export default function Controller(props: ControllerProps): JSX.Element {
  const btns = [
    {title: '选择影片', onPress: () => pickVideo()},
    {title: '查看缓存', onPress: () => {}},
  ];

  const pickVideo = async () => {
    const permission = await requestPermission('android.permission.READ_EXTERNAL_STORAGE');
    console.log(permission);
    // if (permission) {
    const pickValue = await DocumentPicker.pickSingle({
      copyTo: 'cachesDirectory',
      type: DocumentPicker.types.video,
    });
    const totalSize = pickValue.size ? pickValue.size : 0;

    if (pickValue.fileCopyUri) {
      const outFilePath = CACHE_DIR + '/video_' + new Date().getTime() + '.mp4';
      videoTranscoding(pickValue.fileCopyUri, outFilePath, totalSize);
    } else {
      Alert.alert('选择视频出错');
    }
    // }
  };

  const videoTranscoding = async (targetFile: string, outFile: string, totalSize: number) => {
    console.warn(totalSize);
    // -aspect 16:9
    const mediaSession = await FFprobeKit.getMediaInformation(targetFile);
    const mediaDuration = Math.floor(mediaSession.getMediaInformation().getDuration() * 1000); // 获取的秒数，转换毫秒便于进度处理

    const commandStr = new FFmpegCommand(targetFile, outFile);
    commandStr.add('-s 1920x1080').add('-r 30');
    FFmpegKit.executeAsync(
      commandStr.getCommand(),
      async session => {
        props.setVideoUri(outFile);
        const stat = await RNFS.stat(outFile);
        console.log('[stat]', stat);
      },
      undefined,
      statistics => {
        console.warn('【execute statistics】', Math.floor((statistics.getTime() / mediaDuration) * 100) + '%');
      },
    );
  };

  console.log(props);

  return (
    <View style={styles.container}>
      {btns.map(btn => (
        <TouchableHighlight key={btn.title} onPress={btn.onPress} style={styles.btn}>
          <Text style={styles.btnText}>{btn.title}</Text>
        </TouchableHighlight>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  btn: {
    padding: 12,
    marginTop: 12,
    backgroundColor: '#3ddc84',
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
