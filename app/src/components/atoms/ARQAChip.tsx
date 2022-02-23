import { Position } from 'geojson';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
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
});

interface Props {
  coord?: Position;
  size: 'sm' | 'md';
  value?: QAType;
  shadowStyle?: StyleProp<ViewStyle>;
}

const ARQAChip = ({ size, shadowStyle, coord, value }: Props) => {
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
      shadowStyle,
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
