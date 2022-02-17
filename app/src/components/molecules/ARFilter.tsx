import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {theme} from '../../theme';
import ARFilterItemComponent from '../atoms/ARFilterItemComponent';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 23,
  },
});

export interface ARFilterItem {
  label: string;
  selected?: boolean;
  value: any;
}

export interface ARFilterProps {
  items: ARFilterItem[];
  multiple?: boolean;
  onChange: (selectedItems: ARFilterItem[]) => void;
}

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
      <>
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
      </>
    </ScrollView>
  );
};
