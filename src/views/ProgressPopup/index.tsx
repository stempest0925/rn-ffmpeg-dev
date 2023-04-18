import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";

import SvgProgress from "./useSvgProgress_withCircle";
import ProgressStore from "../../models/progress";

function ProgressPopup() {
  if (ProgressStore.visible) {
    return (
      <View style={styles.container}>
        <SvgProgress progress={ProgressStore.num} size={250} strokeWidth={12} />
        <Text style={styles.progressText}>{ProgressStore.text}</Text>
        <TouchableHighlight style={styles.cancelBtn} onPress={() => {}}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableHighlight>
      </View>
    );
  }
  return null;
}

export default observer(ProgressPopup);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  progressText: {
    marginVertical: 24,
    fontSize: 20,
    fontWeight: "bold",
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "yellow",
    borderRadius: 9,
  },
  cancelText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
