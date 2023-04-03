import React, {useState} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import useSvgProgress from './useSvgProgress_withCircle';

export default function useProgressPopup() {
  // const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const {SvgProgressRender, toggleProgress} = useSvgProgress({size: 250, strokeWidth: 12});

  const toggleVisible = (_visible?: boolean) => {
    setVisible(_visible === undefined ? !_visible : _visible);
  };

  const setProgressv1 = (progress: number) => {
    if (progress >= 100) {
      // toggleVisible(false);
    }
    // setProgress(progress);
    toggleProgress(progress);
  };

  const ProgressPopup = () => {
    if (visible) {
      return (
        <View style={styles.container}>
          <SvgProgressRender />
          <Text style={styles.progressText}>文件转码中，请稍后....</Text>
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

// function LoadingPointText() {
//   const [pointText, setPointText] = useState('.');

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (pointText.length >= 6) {
//         setPointText('.');
//       } else {
//         setPointText(pointText + '.');
//       }
//       clearTimeout(timer);
//     }, 300);
//   }, [pointText]);

//   return <Text style={{fontSize: 20, fontWeight: 'bold'}}>{pointText}</Text>;
// }

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
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 24,
  },
  cancelBtn: {
    padding: 12,
    backgroundColor: 'yellow',
  },
});
