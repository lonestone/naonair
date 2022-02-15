import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {theme} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 12,
    // paddingVertical: 6,
    marginHorizontal: 4,
    // height: 32,
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  chipLabel: {
    color: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedChipLabel: {
    color: theme.colors.white,
  },
});

export interface ARFilterItem {
  label: string;
  selected?: boolean;
  value: any;
}

interface ARFilterItemProps {
  label: string;
  selected: boolean;
  onPress?: () => void;
}

export interface ARFilterProps {
  items: ARFilterItem[];
  multiple?: boolean;
  onChange: (selectedItems: ARFilterItem[]) => void;
}

const ARFilterItemComponent = ({
  label,
  selected,
  onPress,
}: ARFilterItemProps) => {
  const styleChip = selected
    ? StyleSheet.flatten([styles.chip, styles.selectedChip])
    : styles.chip;

  const styleChipLabel = selected
    ? StyleSheet.flatten([styles.chipLabel, styles.selectedChipLabel])
    : styles.chipLabel;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styleChip}>
        <Text style={styleChipLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ({items, onChange, multiple}: ARFilterProps) => {
  const [propsItems, setPropsItems] = useState<ARFilterItem[]>(items);

  useEffect(() => {
    selectAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = propsItems.filter(item => item.selected);

  const selectAll = () => {
    setPropsItems(propsItems.map(item => ({...item, selected: true})));
    onChange(propsItems);
  };

  const selectOne = (index: number) => {
    if (filtered.length === propsItems.length || !multiple) {
      propsItems.map(temp => (temp.selected = false));
      propsItems[index].selected = true;
    } else {
      propsItems[index].selected = !propsItems[index].selected;
    }

    setPropsItems([...propsItems]);

    onChange(propsItems.filter(item => item.selected));
  };

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}>
      <ARFilterItemComponent
        key="arfilter-item-all"
        label="Tous"
        selected={filtered.length === propsItems.length}
        onPress={selectAll}
      />

      {propsItems.map((item, index) => (
        <ARFilterItemComponent
          key={`arfilter-item-${index}`}
          label={item.label}
          selected={!!item.selected && filtered.length !== propsItems.length}
          onPress={() => selectOne(index)}
        />
      ))}
    </ScrollView>
  );
};
