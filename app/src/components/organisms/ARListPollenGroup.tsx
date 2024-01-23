import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { PollenSettings } from '../../actions/pollenNotifications';
import ARNotificationRow from '../molecules/ARNotificationRow';

interface ARListPollenGroupProps {
  pollens: PollenSettings[];
  groupName: string;
  setPollenValue: (pollen: PollenSettings) => void;
  loading: boolean;
}

const ARListPollenGroup = ({
  pollens,
  groupName,
  setPollenValue,
  loading,
}: ARListPollenGroupProps) => {
  const [filteredPollens, setFilteredPollens] = useState<PollenSettings[]>([]);

  useEffect(() => {
    setFilteredPollens(pollens.filter(pollen => pollen.group === groupName));
  }, [groupName, pollens]);

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
    <View key={groupName}>
      <ARNotificationRow
        name={groupName}
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
        renderItem={({ item: { name, group, value } }) => (
          <ARNotificationRow
            name={name}
            value={value}
            onChange={(changedValue: boolean) =>
              setPollenValue({ name, value: changedValue, group })
            }
            loading={loading}
          />
        )}
      />
    </View>
  );
};

export default ARListPollenGroup;
