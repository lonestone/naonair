import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { fonts } from '../../theme';

export enum ARButtonSize {
  Small = 'small',
  Medium = 'medium',
}

type ARButtonType = {
  label: string;
  mode?: 'text' | 'outlined' | 'contained' | undefined;
  icon?:
    | string
    | ((props: {
        size: number;
        color: string;
        allowFontScaling?: boolean | undefined;
      }) => React.ReactNode);
  disabled?: boolean;
  loading?: boolean;
  size?: ARButtonSize;
  onPress: any;
  styleContainer?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  isReversed?: boolean;
};

const styles = StyleSheet.create({
  button: {
    padding: 0,
    borderRadius: 48,
  },
  labelStyle: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'none',
    letterSpacing: 0.01,
    ...fonts.Lato.semibold,
  },

  mdContentStyle: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  smContentStyle: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
});

export const ARButton = ({
  label,
  mode,
  icon,
  loading,
  disabled,
  size,
  onPress,
  styleContainer,
  labelStyle,
  isReversed,
}: ARButtonType) => {
  return (
    <Button
      loading={!!loading}
      disabled={!!disabled}
      icon={icon ? icon : undefined}
      mode={mode || 'contained'}
      onPress={onPress}
      contentStyle={StyleSheet.flatten([
        size === ARButtonSize.Medium
          ? styles.mdContentStyle
          : styles.smContentStyle,
        isReversed && { flexDirection: 'row-reverse' },
      ])}
      labelStyle={StyleSheet.flatten([styles.labelStyle, labelStyle])}
      style={StyleSheet.flatten([styles.button, styleContainer])}>
      {label}
    </Button>
  );
};
