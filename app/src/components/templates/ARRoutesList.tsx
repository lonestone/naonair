import React, { useEffect } from 'react';
import { StyleSheet, View, VirtualizedList } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { ARParcours, ParcoursCategory } from '../../actions/parcours';
import { useParcours } from '../../hooks/useParcours';
import ARRouteItem from '../molecules/ARRouteItem';
import { ARFab } from '../atoms/ARFab';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationScreenProp, StackParamList } from '../../types/routes';

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
  const { parcours, refreshList, isLoading } = useParcours(filters);
  const { navigate } = useNavigation<StackNavigationScreenProp>();
  const route = useRoute<RouteProp<StackParamList, 'Home'>>();

  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <View style={styles.container}>
      {parcours.length > 0 && !isLoading && (
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
        </View>
      )}
      <ARFab icon="plus" onPress={() => navigate('NewParcours')} />
      {isLoading && (
        <ActivityIndicator style={styles.container} size="large" animating />
      )}
    </View>
  );
};
