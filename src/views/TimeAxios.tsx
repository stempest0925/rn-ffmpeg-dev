import React from 'react';
import {StyleSheet, View, Text, ScrollView, Image, Platform} from 'react-native';

interface TimeAxiosProps {
  thumbnailList: string[] | null;
}

function TimeAxios(props: TimeAxiosProps): JSX.Element {
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        {props.thumbnailList &&
          props.thumbnailList.map((filepath, index) => <Image key={index} source={{uri: filepath}} style={styles.thumbnail} />)}
      </ScrollView>
    </View>
  );
}

export default TimeAxios;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  thumbnail: {
    width: 74,
    height: 42,
  },
});
