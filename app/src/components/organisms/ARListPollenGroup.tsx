import React, { useEffect, useMemo, useState } from 'react';
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
  container: {},
});

const ARListPollenGroup = ({
  pollens,
  group,
  setPollenValue,
  loading,
}: ARListPollenGroupProps) => {
  const [filteredPollens, setFilteredPollens] = useState<PollenSettings[]>([]);

  useEffect(() => {
    setFilteredPollens(pollens.filter(pollen => pollen.group === group));
  }, [group, pollens]);

  const handleOnChangeAll = (value: boolean) => {
    for (const pollen of filteredPollens) {
      setPollenValue({ name: pollen.name, value, group: pollen.group });
    }
  };

  const getSelectAllValue = useMemo(() => {
    if (!filteredPollens || filteredPollens.length === 0) {
      return false;
    }

    return filteredPollens.every(pollen => pollen.value === true);
  }, [filteredPollens]);

  return (
    <View key={group} style={styles.container}>
      <ARNotificationRow
        name={group}
        value={getSelectAllValue}
        onChange={handleOnChangeAll}
        loading={loading}
        isTitle={true}
        showSelectAll={true}
      />
      <FlatList
        keyExtractor={item => item.name}
        data={filteredPollens}
        scrollEnabled={false}
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

export default ARListPollenGroup;
