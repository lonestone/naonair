import { Position } from 'geojson';
import React, { useCallback, useEffect } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { getQAFromPosition } from '../../actions/qa';
import { LegendItem } from '../../types/legends';

const styles = StyleSheet.create({
  chip: {
    marginVertical: 5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
  },
});

interface Props {
  coord: Position;
  item: LegendItem;
  size: 'sm' | 'md';
  shadowStyle?: StyleProp<ViewStyle>;
}

const ARQAChip = ({ item, size, shadowStyle, coord }: Props) => {
  const getQA = useCallback(async () => {
    try {
      const temp = getQAFromPosition(coord);
      console.info(temp);
    } catch (e) {
      console.info(e);
    }
  }, [coord]);

  useEffect(() => {
    getQA();
  }, [getQA]);

  const styleChip = (item: LegendItem) => {
    return StyleSheet.flatten([
      { backgroundColor: item.color },
      styles.chip,
      shadowStyle,
    ]);
  };
  return (
    <View style={styleChip(item)}>
      <Text
        style={[
          { fontWeight: 'bold', fontSize: size === 'sm' ? 12 : 16 },
          (item.labelColor as TextStyle) && {
            color: item.labelColor,
          },
        ]}>
        {item.label}
      </Text>
    </View>
  );
};

export default ARQAChip;
