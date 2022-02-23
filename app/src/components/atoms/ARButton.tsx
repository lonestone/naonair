import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { theme } from '../../theme';

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
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 48,
    padding: 0,
  },
  labelStyle: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
    textTransform: 'none',
    letterSpacing: 0.01,
  },

  mdContentStyle: {
    paddingHorizontal: 24,
    paddingVertical: 14,
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
}: ARButtonType) => {
  return (
    <Button
      loading={!!loading}
      disabled={!!disabled}
      icon={icon ? icon : undefined}
      mode={mode || 'contained'}
      onPress={onPress}
      contentStyle={
        size === ARButtonSize.Medium
          ? styles.mdContentStyle
          : styles.smContentStyle
      }
      labelStyle={styles.labelStyle}
      style={StyleSheet.flatten([styles.button, styleContainer])}>
      {label}
    </Button>
  );
};
