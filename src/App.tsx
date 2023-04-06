import React, {useReducer} from 'react';
import {StyleSheet, View} from 'react-native';
import {initialState, reducer} from './views/reducer';

// children
import VideoView from './views/VideoView';
import TimeAxios from './views/TimeAxios';
import Controller from './views/Controller';
// action
import {SetThumbnailList, setVideoUri} from './views/action';

export default function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <VideoView uri={state.uri} />
      </View>
      <TimeAxios thumbnailList={state.thumbnailList} />
      <Controller
        setVideoUri={(uri: string) => dispatch(setVideoUri(uri))}
        setThumbnailList={(list: string[]) => dispatch(SetThumbnailList(list))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
