import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { PollenSettings } from '../../actions/pollen';
import ARNotificationRow from '../molecules/ARNotificationRow';

interface ARListPollenGroupProps {
  pollens: PollenSettings[];
  group: string;
  setPollenValue: (pollen: PollenSettings) => void;
  loading: boolean;
}

const styles = StyleSheet.create({
  flatListContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});

const ARListPollenGroup = ({
  pollens,
  group,
  setPollenValue,
  loading,
}: ARListPollenGroupProps) => {
  const [filteredPollens] = useState(
    pollens.filter(pollen => pollen.group === group),
  );

  return (
    <View key={group}>
      <FlatList
        keyExtractor={item => item.name}
        data={filteredPollens}
        style={styles.flatListContainer}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <ARNotificationRow
            name={item.name}
            value={item.value}
            onChange={(value: boolean) =>
              setPollenValue({ name: item.name, value, group: item.group })
            }
            loading={loading}
          />
        )}
      />
    </View>
  );
};

const Separator = () => <View style={{ height: 16 }} />;

export default ARListPollenGroup;
