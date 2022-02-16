import React from 'react';
import {StyleSheet, View, VirtualizedList} from 'react-native';
import ARRouteItem from '../molecules/ARRouteItem';

const styles = StyleSheet.create({
  container: {
    padding: 10,
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

const mockedData: number[] = Array.from({length: 200}, (_, i) => i);

export default () => {
  return (
    <View style={styles.container}>
      <VirtualizedList
        data={mockedData}
        renderItem={() => <ARRouteItem style={styles.item} />}
        keyExtractor={item => `toto-${item}`}
        getItemCount={data => data.length}
        getItem={(data, index) => data[index]}
      />
    </View>
  );
};
