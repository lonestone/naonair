import React from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';
import {LegendItem} from '../../types/legends';

const styles = StyleSheet.create({
  chip: {
    flex: 0,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 5,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

interface Props {
  item: LegendItem;
}

const ARQAChip = ({item}: Props) => {
  const styleChip = (item: LegendItem) => {
    return StyleSheet.flatten([styles.chip, {backgroundColor: item.color}]);
  };
  return (
    <View style={styleChip(item)}>
      <Text
        style={[
          styles.chipLabel,
          (item.labelColor as TextStyle) && {color: item.labelColor},
        ]}>
        {item.label}
      </Text>
    </View>
  );
};

export default ARQAChip;
