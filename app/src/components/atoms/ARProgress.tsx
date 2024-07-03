import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { fonts, theme } from '@theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(37, 36, 78, 0.6)',

    position: 'absolute',
    right: 0,
    left: 0,
    padding: 2,
    paddingVertical: 4,
    elevation: 8,
    shadowOpacity: 0.2,
    shadowColor: 'black',
    shadowOffset: { height: 8, width: 0 },
    shadowRadius: 10,
  },
  gauge: {
    backgroundColor: 'rgba(72, 99, 241, 0.8)',
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
  },
  text: {
    ...fonts.Lato.regular,
    fontSize: 10,
    lineHeight: 10,
    color: theme.colors.white,
  },
});

export interface ARProgressProps {
  percent: number;
  hideOnComplete?: boolean;
  label?: string;
}

export default ({ label, percent }: ARProgressProps) => {
  const [containerWidth, setContainerWidth] = useState<number>(100);
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(percent * containerWidth, { duration: 200 });
  }, [percent, containerWidth, width]);

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <View
      style={styles.container}
      onLayout={({ nativeEvent }) =>
        setContainerWidth(nativeEvent.layout.width)
      }>
      <Animated.View style={[styles.gauge, animatedStyles]} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};
