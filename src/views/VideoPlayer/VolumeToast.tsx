import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import VolumeOffIcon from "../Icon/VolumeOff";
import VolumeLowIcon from "../Icon/VolumeLow";
import VolumeHighIcon from "../Icon/VolumeHigh";

export default function VolumeToast() {
  const [visible, setVisible] = useState(false);
  const [volume, setVolume] = useState(0);

  const VolumeIconRender = () => {
    if (volume === 0) {
      return <VolumeOffIcon size={42} color="rgba(255,255,255,0.6)" />;
    } else if (volume < 50) {
      return <VolumeLowIcon size={42} color="rgba(255,255,255,0.6)" />;
    } else {
      return <VolumeHighIcon size={42} color="rgba(255,255,255,0.6)" />;
    }
  };

  const VolumeToastRender = () => {
    if (visible) {
      return (
        <View style={styles.volumeContainer}>
          <VolumeIconRender />
          <View style={styles.volumeTrack}>
            <View style={[styles.volumeProgress, { height: volume * 100 + "%" }]} />
          </View>
        </View>
      );
    }
    return null;
  };

  return {
    VolumeToastRender,
    setVolume,
    openVolumeToast: () => setVisible(true),
    closeVolumeToast: () => setVisible(false),
  };
}

const styles = StyleSheet.create({
  volumeContainer: {
    padding: 18,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 6,
  },
  volumeTrack: {
    width: 5,
    height: "100%",
    marginLeft: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 3,
    position: "relative",
  },
  volumeProgress: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 3,
    position: "absolute",
    left: 0,
    bottom: 0,
  },
});
