import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { timeFormat } from "../../helpers/utils";

interface SeekToastProps {
  duration: number;
}

export default function SeekToast(props: SeekToastProps) {
  const [visible, setVisible] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  console.log("SeekToast", visible);

  const SeekToastRender = () => {
    if (visible) {
      return (
        <View style={styles.seekContainer}>
          <Text style={styles.seekText}>{timeFormat(seekTime)}</Text>
          <Text style={styles.seekDivider}>|</Text>
          <Text style={styles.seekText}>{timeFormat(props.duration)}</Text>
        </View>
      );
    }
    return null;
  };

  return {
    SeekToastRender,
    setSeekTime,
    openSeekToast: () => setVisible(true),
    closeSeekToast: () => setVisible(false),
  };
}

const styles = StyleSheet.create({
  seekContainer: {
    padding: 16,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 6,
  },
  seekText: {
    color: "#fff",
    fontSize: 16,
  },
  seekDivider: {
    marginHorizontal: 6,
    color: "#fff",
    fontSize: 16,
  },
});
