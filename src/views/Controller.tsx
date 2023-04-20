import React from "react";
import { StyleSheet, View, Text, TouchableHighlight, Alert, Platform } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { FFmpegKit } from "ffmpeg-kit-react-native";

// import {requestPermission} from '../helpers/permission';
import fileSystem from "../helpers/fileSystem";
import FFmepg from "../helpers/ffmpeg";
import ProgressStore from "../models/progress";
import videoStore from "../models";
import { observer } from "mobx-react-lite";

function Controller(): JSX.Element {
  const btns = [
    { title: "选择影片", onPress: () => importVideo() },
    { title: "查看缓存", onPress: () => {} },
  ];

  const importVideo = async () => {
    // await fileSystem.mkdir("videos/a11/222", "cache");

    // copyTo: "cachesDirectory",
    const pickValue = await DocumentPicker.pickSingle({ type: DocumentPicker.types.video });
    console.log(pickValue);
    if (pickValue.name) {
      videoStore.addAssets(pickValue.name);
    }
    // const outputFile = fileSystem.DOCUMENT_ROOT_DIR + "/videos/";
    // FFmepg.transcoding(
    //   pickValue.uri,
    //   outputFile,
    //   () => {},
    //   progress => {
    //     ProgressStore.setProgress(progress);
    //   },
    // );
  };

  const confirmAssets = () => {};

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
