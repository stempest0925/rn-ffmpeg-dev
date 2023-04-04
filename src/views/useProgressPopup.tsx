import React, {useState} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import useSvgProgress from './useSvgProgress_withCircle';

interface ProgressPopupProps {
  onCancelTask: () => void;
}

export default function useProgressPopup(props: ProgressPopupProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const {SvgProgressRender, toggleProgress} = useSvgProgress({size: 250, strokeWidth: 12});

  const toggleVisible = (_visible?: boolean) => {
    setVisible(_visible === undefined ? !_visible : _visible);
  };

  const setProgress = (_progress: number) => {
    toggleProgress(_progress);
    if (_progress >= 100) {
      toggleVisible(false);
    }
  };

  const onCancelTask = () => {
    toggleVisible(false);
    props.onCancelTask();
  };

  const ProgressPopup = () => {
    if (visible) {
      return (
        <View style={styles.container}>
          <SvgProgressRender />
          <Text style={styles.progressText}>文件转码中，请稍后....</Text>
          <TouchableHighlight style={styles.cancelBtn} onPress={() => onCancelTask()}>
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return null;
  };

  return {
    ProgressPopup,
    setProgress,
    openProgressPopup: () => toggleVisible(true),
    closeProgressPopup: () => toggleVisible(false),
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  progressText: {
    marginVertical: 24,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'yellow',
    borderRadius: 9,
  },
  cancelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
