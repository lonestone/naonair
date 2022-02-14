import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Caption, Headline} from 'react-native-paper';
import Header from '../components/Header';
import MapView from '../components/MapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header>
        <View>
          <Headline>Les points d'intérêts</Headline>
        </View>
        <Caption>Découvrez la qualité de l'air en temps réel</Caption>
      </Header>
      <MapView />
    </SafeAreaView>
  );
};
