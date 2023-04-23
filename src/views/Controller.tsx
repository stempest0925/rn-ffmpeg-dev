import React from "react";
import { StyleSheet, View, Text, TouchableHighlight, Alert, Platform } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { FFmpegKit } from "ffmpeg-kit-react-native";

// import {requestPermission} from '../helpers/permission';
import FFmepg from "../helpers/ffmpeg";
import ProgressStore from "../models/progress";
import videoStore from "../models";
import { observer } from "mobx-react-lite";
import fileSystem from "../helpers/fileSystem";

function Controller(): JSX.Element {
  const btns = [
    { title: "选择影片", onPress: () => importVideo() },
    { title: "查看缓存", onPress: () => {} },
  ];

  const importVideo = async () => {
    const pickVideo = await DocumentPicker.pickSingle({ type: DocumentPicker.types.video, copyTo: "cachesDirectory" });
    if (pickVideo.name && pickVideo.fileCopyUri) {
      await videoStore.addAssets(pickVideo.name);
      const assets = videoStore.getAssets(pickVideo.name, true);

      if (assets) {
        const exists = await fileSystem.exists(assets.path);
        if (!exists) {
          ProgressStore.openProgress("文件转码中，请稍后....");
          FFmepg.transcoding(
            pickVideo.fileCopyUri,
            assets.path,
            () => {
              console.log("完成");
              // 不存在
              ProgressStore.closeProgress();
            },
            progress => {
              ProgressStore.setProgress(progress);
            },
          );
        }
        // 已存在
      }
    }
  };

  // const getThumbnailList = (filePath: string) => {
  //   const cacheDir = fileSystem.CACHE_ROOT_DIR + "thumbnails/";
  //   const outImage = `${cacheDir}image_%02d.jpg`;
  //   FFmpegKit.execute(`-i ${filePath} -r 2 ${outImage}`).then(async () => {
  //     const readDir = await RNFS.readDir(cacheDir);
  //     props.setThumbnailList(readDir.map(item => fileSystem.ROOT_PREFIX + item.path));
  //   });
  // };

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

export default observer(Controller);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  btn: {
    padding: 12,
    marginTop: 12,
    backgroundColor: "#3ddc84",
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
