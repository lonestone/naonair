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
  // const isPressed = useSharedValue(false);
  // const offset = useSharedValue(minHeight);
  // const start = useSharedValue(0);

  const isExpanded = useSharedValue<boolean>(false);

  const height = useDerivedValue(() => {
    runOnJS(isExpanded.value ? onExpanded : onFold)();
    return isExpanded.value ? maxHeight : minHeight;
  });

  // useEffect(() => {
  //   console.info(height.value);
  //   setIsExpanded(height.value === maxHeight);
  // }, [height, setIsExpanded, maxHeight]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(height.value),
    };
  });

  // const gesture = Gesture.Pan()
  //   .onBegin(() => (isPressed.value = true))
  //   .onUpdate(e => (offset.value = -e.translationY + start.value))
  //   .onEnd(() => (start.value = offset.value))
  //   .onFinalize(() => (isPressed.value = false));

  const tapGesture = Gesture.Tap().onStart(() => {
    // offset.value = !isExpanded ? maxHeight : minHeight;
    // console.info({ isExpanded, minHeight, offset });
    // setIsExpanded(!isExpanded);
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
