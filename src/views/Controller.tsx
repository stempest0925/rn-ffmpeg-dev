import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Alert, Platform} from 'react-native';
// import {requestPermission} from '../helpers/permission';

import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import FFmepg from '../helpers/ffmpegCommand';
import useProgressPopup from './ProgressPopup';

function getDir(defaultPath: 'cache' | 'document') {
  const path = defaultPath === 'document' ? RNFS.DocumentDirectoryPath : RNFS.CachesDirectoryPath;
  return Platform.OS === 'android' ? 'file://' + path : path;
}

interface ControllerProps {
  setVideoUri: (uri: string) => void;
}

export default function Controller(props: ControllerProps): JSX.Element {
  const {ProgressPopup, setProgress, openProgressPopup} = useProgressPopup({onCancel: () => {}});

  const btns = [
    {title: '选择影片', onPress: () => pickVideo()},
    {title: '查看缓存', onPress: () => {}},
  ];

  const pickVideo = async () => {
    // const permission = await requestPermission('android.permission.READ_EXTERNAL_STORAGE');

    const pickValue = await DocumentPicker.pickSingle({
      copyTo: 'cachesDirectory',
      type: DocumentPicker.types.video,
    });

    if (pickValue.fileCopyUri) {
      const outFilePath = getDir('cache') + '/video_' + new Date().getTime() + '.mp4';
      videoTranscoding(pickValue.fileCopyUri, outFilePath);
    } else {
      Alert.alert('选择视频出错');
    }
  };

  const videoTranscoding = async (targetFile: string, outFile: string) => {
    openProgressPopup();
    FFmepg.transcoding(
      targetFile,
      outFile,
      async () => {
        setProgress(100);
        props.setVideoUri(outFile);
      },
      progress => {
        setProgress(progress);
      },
    );
  };

  return (
    <>
      <View style={styles.container}>
        {btns.map(btn => (
          <TouchableHighlight key={btn.title} onPress={btn.onPress} style={styles.btn}>
            <Text style={styles.btnText}>{btn.title}</Text>
          </TouchableHighlight>
        ))}
      </View>
      <ProgressPopup />
    </>
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
