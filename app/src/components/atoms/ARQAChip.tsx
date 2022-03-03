import { Position } from 'geojson';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getQAFromPosition, QAType } from '../../actions/qa';
import { fonts } from '../../theme';

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
  value?: QAType;
  shadow?: boolean;
}

const ARQAChip = ({ size, shadow, coord, value }: Props) => {
  const [qa, setQA] = useState<QAType | undefined>();

  const getQA = useCallback(async () => {
    if (!coord) {
      return;
    }

    try {
      const qa = await getQAFromPosition(coord);
      setQA(qa);
    } catch (e) {
      console.info(e);
    }
  }, [coord]);

  useEffect(() => {
    if (!value) {
      getQA();
    }
  }, [getQA, value]);

  const styleChip = () => {
    return StyleSheet.flatten([
      { backgroundColor: qa?.main || value?.main },
      styles.chip,
      shadow ? styles.chipShadow : {},
    ]);
  };

  return (
    <View style={styleChip()}>
      <Text
        style={[
          styles.text,
          styles[`${size}Text`],
          {
            color: qa?.light || value?.light,
          },
        ]}>
        {qa?.label || value?.label || ''}
      </Text>
    </View>
  );
};

export default ARQAChip;
