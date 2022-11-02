import React, { ReactElement } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ARElasticViewProp {
  children: ReactElement;
  maxHeight?: number;
  minHeight?: number;
  onExpanded: () => void;
  onFold: () => void;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

export default ({
  children,
  maxHeight = Dimensions.get('screen').height,
  minHeight = 0,
  onExpanded,
  onFold,
}: ARElasticViewProp) => {
  const isExpanded = useSharedValue<boolean>(false);

  const height = useDerivedValue(() => {
    runOnJS(isExpanded.value ? onExpanded : onFold)();
    return isExpanded.value ? maxHeight : minHeight;
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(height.value),
    };
  });

  const tapGesture = Gesture.Tap().onStart(() => {
    isExpanded.value = !isExpanded.value;
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={StyleSheet.flatten([styles.container, animatedStyles])}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
