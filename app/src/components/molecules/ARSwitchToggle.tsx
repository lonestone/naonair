import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '@theme';

export interface SwitchToggleItem {
  label?: string;
  icon: string;
  key: string;
}

export interface SwitchToggleProps {
  items: SwitchToggleItem[];
  activeColor: string;
  activeIndex: number;
  onChange: (index: number) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: '#EDEFFE',
    flex: 0,
    overflow: 'hidden',
  },
  item: {
    padding: 12,
    flex: 0,
  },
});

export default ({
  items,
  activeColor,
  activeIndex,
  onChange,
}: SwitchToggleProps & ViewProps) => {
  const isSelected = (index: number) => {
    if (activeIndex !== index) {
      return styles.item;
    }

    return StyleSheet.flatten([
      styles.item,
      {
        backgroundColor: activeColor,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity key={item.key} onPress={() => onChange(index)}>
          <View style={isSelected(index)}>
            <Icon
              name={item.icon}
              size={15}
              color={
                activeIndex !== index
                  ? theme.colors.blue[400]
                  : theme.colors.white
              }
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
