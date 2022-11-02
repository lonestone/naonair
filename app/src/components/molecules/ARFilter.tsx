import React, { ReactElement, useEffect, useState } from 'react';
import {
  Insets,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import ARFilterItemComponent from '../atoms/ARFilterItemComponent';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 23,
  },
});

export interface ARFilterItem<T = string> {
  label: string;
  selected?: boolean;
  value: T;
  icon?: ReactElement | ((selected: boolean) => ReactElement);
}

export interface ARFilterProps<T> {
  items: ARFilterItem<T>[];
  multiple?: boolean;
  style?: StyleProp<ViewStyle>;
  contentInset?: Insets;
  onChange: (selectedItems: ARFilterItem<T>[]) => void;
}

function ARFilter<T = string>({
  items,
  onChange,
  multiple,
  style,
  contentInset,
}: ARFilterProps<T>) {
  const [propsItems, setPropsItems] = useState<ARFilterItem<T>[]>(items);

  useEffect(() => {
    //HACK : remove deps to call `selectAll` only once
    multiple && selectAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = propsItems.filter(item => item.selected);

  const selectAll = () => {
    setPropsItems(propsItems.map(item => ({ ...item, selected: true })));
    onChange(propsItems);
  };

  const selectOne = (index: number) => {
    if (filtered.length === propsItems.length || !multiple) {
      propsItems.map(temp => (temp.selected = false));
      propsItems[index].selected = true;
    } else {
      propsItems[index].selected = !propsItems[index].selected;
    }

    // handle double clicked filter when oly one selected to select All category
    if (!propsItems.filter(item => item.selected).length) {
      selectAll();
    } else {
      setPropsItems([...propsItems]);
      onChange(propsItems.filter(item => item.selected));
    }
  };

  return (
    <ScrollView
      style={StyleSheet.flatten([styles.container, style])}
      horizontal
      contentInset={contentInset}
      showsHorizontalScrollIndicator={false}>
      <>
        {multiple && (
          <ARFilterItemComponent
            key="arfilter-item-all"
            label="Tous"
            selected={filtered.length === propsItems.length}
            onPress={selectAll}
          />
        )}
        {propsItems.map((item, index) => (
          <ARFilterItemComponent
            key={`arfilter-item-${index}`}
            label={item.label}
            selected={!!item.selected && filtered.length !== propsItems.length}
            icon={item.icon}
            onPress={() => selectOne(index)}
          />
        ))}
      </>
    </ScrollView>
  );
}

export default ARFilter;
