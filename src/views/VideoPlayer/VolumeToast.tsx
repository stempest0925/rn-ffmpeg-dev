import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import VolumeOffIcon from "../Icon/VolumeOff";

interface VolumeToastProps {
  volume: number;
}

export default function VolumeToast(props: VolumeToastProps) {
  const [visible, setVisible] = useState(false);

  const VolumeToastRender = () => {
    if (visible) {
      return (
        <View style={styles.volumeContainer}>
          <VolumeOffIcon size={42} color="rgba(255,255,255,0.6)" />
          <View style={styles.volumeTrack}>
            <View style={[styles.volumeProgress, { height: props.volume + "%" }]} />
          </View>
        </View>
      );
    }
    return null;
  };

  return { VolumeToastRender, openVolumeToast: () => setVisible(true), closeVolumeToast: () => setVisible(false) };
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
