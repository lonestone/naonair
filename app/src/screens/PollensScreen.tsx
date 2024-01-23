import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { Provider } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const PollensScreen = () => {
  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Text>Salut</Text>
      </SafeAreaView>
    </Provider>
  );
};

export default PollensScreen;
