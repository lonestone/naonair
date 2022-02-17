import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {theme} from '../../theme';

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    marginHorizontal: 4,
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

interface ARFilterItemProps {
  label: string;
  selected: boolean;
  onPress?: () => void;
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
export default ARFilterItemComponent;
