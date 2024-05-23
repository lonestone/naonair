import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal } from 'react-native-paper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const ARFullScreenLoading = () => {
  return (
    <Portal>
      <View style={style.container}>
        <ActivityIndicator size="large" animating />
      </View>
    </Portal>
  );
};

export default ARFullScreenLoading;
