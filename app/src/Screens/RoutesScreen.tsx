import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Caption, Headline} from 'react-native-paper';
import ARHeader from '../components/atoms/ARHeader';
import ARRoutesList from '../components/templates/ARRoutesList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headlineContainer: {
    flexDirection: 'row',
  },
  headline: {
    flex: 1,
    alignItems: 'stretch',
  },
});

export default () => {
  return (
    <>
      <ARHeader>
        <SafeAreaView>
          <View style={styles.headlineContainer}>
            <Headline style={styles.headline}>Les parcours</Headline>
          </View>
          <Caption>
            Retrouvez des suggestions de promenades et d’itinéraires sportifs
            basés sur la qualité de l’air
          </Caption>
        </SafeAreaView>
      </ARHeader>
      <SafeAreaView style={styles.container}>
        <ARRoutesList />
      </SafeAreaView>
    </>
  );
};
