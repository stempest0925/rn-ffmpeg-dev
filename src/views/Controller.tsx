import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Alert, Platform} from 'react-native';
// import {requestPermission} from '../helpers/permission';

import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import FFmepg from '../helpers/ffmpegCommand';
import useProgressPopup from './ProgressPopup';
import fileSystem from '../helpers/fileSystem';
import {FFmpegKit} from 'ffmpeg-kit-react-native';

function getDir(defaultPath: 'cache' | 'document') {
  const path = defaultPath === 'document' ? RNFS.DocumentDirectoryPath : RNFS.CachesDirectoryPath;
  return Platform.OS === 'android' ? 'file://' + path : path;
}

interface ControllerProps {
  setVideoUri: (uri: string) => void;
  setThumbnailList: (list: string[]) => void;
}

export default function Controller(props: ControllerProps): JSX.Element {
  const {ProgressPopup, setProgress, openProgressPopup} = useProgressPopup({onCancel: () => {}});

  const btns = [
    {title: '选择影片', onPress: () => pickVideo()},
    {title: '查看缓存', onPress: () => {}},
  ];

  const pickVideo = async () => {
    // await requestPermission('android.permission.READ_EXTERNAL_STORAGE');
    // fileSystem.clearCache('thumbnails').then(res => console.log('清理thumbnail: ', res));

    await fileSystem.mkdir('videos', 'cache');
    // await fileSystem.mkdir('thumbnails', 'cache');

    const pickValue = await DocumentPicker.pickSingle({
      copyTo: 'cachesDirectory',
      type: DocumentPicker.types.video,
    });

    if (pickValue.fileCopyUri) {
      props.setVideoUri(pickValue.fileCopyUri);
      // const outFilePath = getDir('cache') + '/videos/video_' + new Date().getTime() + '.mp4';
      // videoTranscoding(pickValue.fileCopyUri, outFilePath);
    } else {
      Alert.alert('选择视频出错');
    }
  };

  const videoTranscoding = async (targetFile: string, outFile: string) => {
    openProgressPopup();
    FFmepg.transcoding(
      targetFile,
      outFile,
      () => {
        setProgress(100);
        props.setVideoUri(outFile);
        getThumbnailList(outFile);
      },
      progress => {
        setProgress(progress);
      },
    );
  };

  const getThumbnailList = (filePath: string) => {
    const cacheDir = fileSystem.CACHE_ROOT_DIR + 'thumbnails/';
    const outImage = `${cacheDir}image_%02d.jpg`;
    FFmpegKit.execute(`-i ${filePath} -r 2 ${outImage}`).then(async () => {
      const readDir = await RNFS.readDir(cacheDir);
      props.setThumbnailList(readDir.map(item => fileSystem.ROOT_PREFIX + item.path));
    });
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
