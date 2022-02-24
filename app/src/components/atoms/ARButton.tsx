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
        allowFontScaling?: boolean | undefined;
      }) => React.ReactNode);
  disabled?: boolean;
  loading?: boolean;
  size?: ARButtonSize;
  onPress: any;
  styleContainer?: StyleProp<ViewStyle>;
};

const styles = StyleSheet.create({
  smButton: {
    borderRadius: 20,
    padding: 0,
    height: 40,
    backgroundColor: theme.colors.primary,
  },
  mdButton: {
    borderRadius: 48,
    backgroundColor: theme.colors.primary,
  },
  labelStyle: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
    textTransform: 'none',
  },
  contentStyle: {
    paddingHorizontal: 24,
    paddingVertical: 14,
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
      contentStyle={styles.contentStyle}
      labelStyle={styles.labelStyle}
      style={StyleSheet.flatten([
        size && size === ARButtonSize.Medium
          ? styles.mdButton
          : styles.smButton,
        styleContainer,
      ])}>
      {label}
    </Button>
  );
};
