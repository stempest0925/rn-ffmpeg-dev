import React, {useReducer} from 'react';
import {StyleSheet, View} from 'react-native';
import {initialState, reducer} from './views/reducer';

// children
import VideoView from './views/VideoView';
import Controller from './views/Controller';
// action
import {setVideoUri} from './views/action';

export default function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <VideoView uri={state.uri} />
      </View>
      <Controller setVideoUri={(uri: string) => dispatch(setVideoUri(uri))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
