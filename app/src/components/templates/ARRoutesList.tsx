import React from 'react';
import { StyleSheet, View, VirtualizedList } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { ARParcours, ParcoursCategory } from '../../actions/parcours';
import { useParcours } from '../../hooks/useParcours';
import ARRouteItem from '../molecules/ARRouteItem';
import { ARFab } from '../atoms/ARFab';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationScreenProp } from '../../types/routes';

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
  filters: ParcoursCategory[];
}

export default ({ filters }: ARRoutesListProps) => {
  const { parcours, isLoading } = useParcours(filters);
  const { navigate } = useNavigation<StackNavigationScreenProp>();

  return (
    <View style={styles.container}>
      {parcours.length > 0 && (
        <View>
          <VirtualizedList<ARParcours>
            data={parcours}
            initialNumToRender={5}
            renderItem={({ item }) => (
              <ARRouteItem parcours={item} style={styles.item} />
            )}
            keyExtractor={item => `parcours-${item.properties.id}`}
            getItemCount={data => data.length}
            getItem={(data, index) => data[index]}
          />
          <ARFab icon="plus" onPress={() => navigate('NewParcours')} />
        </View>
      )}
      {isLoading && (
        <ActivityIndicator style={styles.container} size="large" animating />
      )}
    </View>
  );
};
