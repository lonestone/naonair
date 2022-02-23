import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ARCommonHeader from '../components/molecules/ARCommonHeader';
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
      <ARCommonHeader
        headline="Les parcours"
        caption="Retrouvez des suggestions de promenades et d’itinéraires sportifs basés sur la qualité de l’air"
      />

      <SafeAreaView style={styles.container}>
        <ARRoutesList />
      </SafeAreaView>
    </>
  );
};
