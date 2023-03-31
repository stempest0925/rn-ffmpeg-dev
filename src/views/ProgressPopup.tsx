import React, {useState} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import Svg, {Circle, Path, Text as SvgText} from 'react-native-svg';

export default function useProgressPopup() {
  const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = (_visible?: boolean) => {
    setVisible(_visible === undefined ? !_visible : _visible);
  };

  const setProgressv1 = (progress: number) => {
    if (progress >= 100) {
      toggleVisible(false);
    }
    setProgress(progress);
  };

  const ProgressSvg = () => {
    const svgWidth = 300,
      svgHeight = 300;

    function transAngle(angle: number) {
      return (Math.PI * angle) / 180;
    }

    const startAxis = `M${Math.floor(svgWidth / 2)} 0`;
    const progressAxis = [150 + Math.sin(transAngle(300)) * 150, 150 - Math.cos(transAngle(300)) * 150];
    const endAxis = `A${Math.floor(svgWidth / 2)} ${Math.floor(svgWidth / 2)} 0 1 1 ${progressAxis[0]} ${progressAxis[1]}`;
    console.log(startAxis + ' ' + endAxis);
    return (
      <Svg width={svgWidth} height={svgHeight}>
        <Path d={startAxis + ' ' + endAxis} fill="none" stroke="red" strokeWidth={5} />
        <SvgText stroke="purple" fontSize="20" fontWeight="bold" x="100" y="20" textAnchor="middle">
          {progress}%
        </SvgText>
      </Svg>
    );
  };

  const ProgressPopup = () => {
    if (visible) {
      return (
        <View style={styles.container}>
          <ProgressSvg />
          <Text style={styles.progressText}>文件转码中, 请稍后...</Text>
          <TouchableHighlight style={styles.cancelBtn} onPress={() => toggleVisible(false)}>
            <Text>cancel</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return null;
  };

  return {
    ProgressPopup,
    setProgress: setProgressv1,
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
    fontSize: 16,
    marginBottom: 24,
  },
  cancelBtn: {
    padding: 12,
    backgroundColor: 'yellow',
  },
});
