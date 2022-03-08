import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, VirtualizedList } from 'react-native';
import { ARParcours, getAll } from '../../actions/parcours';
import ARRouteItem from '../molecules/ARRouteItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  item: {
    marginVertical: 5,
  },
});

export interface ARRoutesListProps {}

export default () => {
  const [parcours, setParcours] = useState<ARParcours[]>([]);

  const getParcours = useCallback(async () => {
    try {
      setParcours(await getAll());
    } catch (e) {
      console.info(e);
    }
  }, []);

  useEffect(() => {
    getParcours();
  }, [getParcours]);

  return (
    <View style={styles.container}>
      {parcours.length > 0 && (
        <VirtualizedList<ARParcours>
          data={parcours}
          initialNumToRender={5}
          renderItem={({ item }) => (
            <ARRouteItem parcours={item} style={styles.item} />
          )}
          keyExtractor={item => `toto-${item}`}
          getItemCount={data => data.length}
          getItem={(data, index) => data[index]}
        />
      )}
    </View>
  );
};
