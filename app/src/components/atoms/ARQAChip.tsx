import { Position } from 'geojson';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getQAFromPosition, QAType } from '../../actions/qa';

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
});

interface Props {
  coord?: Position;
  size: 'sm' | 'md';
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
          { fontWeight: 'bold', fontSize: size === 'sm' ? 12 : 16 },
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
