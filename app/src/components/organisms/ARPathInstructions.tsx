import {
  Feature,
  LineString,
  lineString,
  nearestPointOnLine,
  point,
} from '@turf/turf';
import { Position } from 'geojson';
import React, { useEffect, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ARInstruction,
  ARPath,
  getDistanceLabel,
  getInstructionFromPathSection,
} from '../../actions/routes';
import ARDivider from '../atoms/ARDivider';

export interface ARPathInstructionsProps {
  path: ARPath;
  style?: StyleProp<ViewStyle>;
  userPosition?: Position;
  scrollEnabled?: boolean;
}

interface InstructionItemProp {
  instruction: ARInstruction;
  isSelected: boolean;
  onLayout: (y: number) => void;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: -8 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    padding: 10,
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
});

const InstructionItem = ({
  instruction,
  isSelected,
  onLayout,
}: InstructionItemProp) => {
  const buildStyle = (): { text: StyleProp<TextStyle> } => {
    return {
      text: {
        fontWeight: isSelected ? 'bold' : 'normal',
      },
    };
  };

  return (
    <>
      <View
        style={styles.itemContainer}
        onLayout={({ nativeEvent }) => {
          const { layout } = nativeEvent;
          onLayout(layout.y);
        }}>
        <Icon name="navigation" />
        <Text style={buildStyle().text}>{instruction.text}</Text>
      </View>
      <ARDivider text={getDistanceLabel(instruction.distance)} />
    </>
  );
};

export default ({
  path,
  style,
  userPosition,
  scrollEnabled,
}: ARPathInstructionsProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsY] = useState<number[]>([]);

  const [line] = useState<Feature<LineString>>(
    lineString(path.points.coordinates),
  );
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  useDerivedValue(() => {
    console.info(scrollEnabled);
    if (!scrollEnabled) {
      scrollTo(scrollViewRef, 0, itemsY[currentIndex] || 0, true);
    }
  }, [scrollEnabled, currentIndex]);

  useEffect(() => {
    if (!userPosition) {
      return;
    }

    const { properties } = nearestPointOnLine(line, point(userPosition));
    if (properties.index) {
      const newInstructionsIndex = getInstructionFromPathSection(
        properties.index + 1,
        currentIndex,
        path.instructions,
      );
      setCurrentIndex(newInstructionsIndex);
    }
  }, [line, userPosition, path, currentIndex]);

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
        <Animated.ScrollView
          ref={scrollViewRef}
          scrollEnabled={!!scrollEnabled}>
          {path.instructions.map((instruction, index) => (
            <InstructionItem
              isSelected={index === currentIndex}
              key={`instruction-${index}`}
              instruction={instruction}
              onLayout={y => (itemsY[index] = y)}
            />
          ))}
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};
