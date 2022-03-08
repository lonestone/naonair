import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, VirtualizedList } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
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

export interface ARRoutesListProps {
  filters: string[];
}

export default ({ filters }: ARRoutesListProps) => {
  const [parcours, setParcours] = useState<ARParcours[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getParcours = useCallback(async () => {
    setIsLoading(true);
    try {
      setParcours(await getAll(filters));
    } catch (e) {
      console.info(e);
    }
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    getParcours();
  }, [getParcours, filters]);

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
      {isLoading && (
        <ActivityIndicator style={styles.container} size="large" animating />
      )}
    </View>
  );
};
