import React, { ReactElement } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { fonts, theme } from '../../theme';

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    marginHorizontal: 4,
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  chipLabel: {
    color: theme.colors.blue[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...fonts.Lato.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  selectedChipLabel: {
    color: theme.colors.white,
  },
});

interface ARFilterItemProps {
  label: string;
  selected: boolean;
  icon?: ReactElement | ((selected: boolean) => ReactElement);
  onPress?: () => void;
}

const ARFilterItemComponent = ({
  label,
  selected,
  onPress,
  icon,
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
        {typeof icon === 'function' ? icon(selected) : icon}
        <Text style={styleChipLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default ARFilterItemComponent;
