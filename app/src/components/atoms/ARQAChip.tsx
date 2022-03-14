import { Position } from 'geojson';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { QAType } from '../../actions/qa';
import { useQA } from '../../hooks/useQA';
import { fonts, theme } from '../../theme';

const styles = StyleSheet.create({
  chip: {
    marginVertical: 5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
    flex: 0,
    overflow: 'hidden',
  },
  chipShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    ...fonts.Lato.bold,
  },
  xsText: {
    fontSize: 10,
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 16,
  },
});

interface Props {
  coord?: Position;
  size: 'xs' | 'sm' | 'md';
  value?: QAType | undefined;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ARQAChip = ({ size, shadow, coord, value, style }: Props) => {
  const [qa, isLoading] = useQA(coord, value);

  const styleChip = () => {
    return StyleSheet.flatten([
      { backgroundColor: qa?.main || value?.main || theme.colors.accent },
      styles.chip,
      shadow ? styles.chipShadow : {},
      style,
    ]);
  };

  return (
    <View style={styleChip()}>
      <Text
        style={[
          styles.text,
          styles[`${size}Text`],
          {
            color: qa?.light || value?.light || theme.colors.blue[300],
          },
        ]}>
        {qa?.label ||
          value?.label ||
          (isLoading && 'récupération') ||
          'non connu'}
      </Text>
    </View>
  );
};

export default ARQAChip;
