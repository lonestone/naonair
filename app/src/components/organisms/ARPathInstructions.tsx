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
import { ScrollView } from 'react-native-gesture-handler';
import { Headline, Text } from 'react-native-paper';
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: -8 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
});

const InstructionItem = ({ instruction, isSelected }: InstructionItemProp) => {
  const buildStyle = (): { text: StyleProp<TextStyle> } => {
    return {
      text: {
        fontWeight: isSelected ? 'bold' : 'normal',
      },
    };
  };

  return (
    <>
      <View style={styles.itemContainer}>
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
  const [currentIndex, setCurrentIndex] = useState<number>(4);
  const [line] = useState<Feature<LineString>>(
    lineString(path.points.coordinates),
  );

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
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <ScrollView scrollEnabled={!!scrollEnabled}>
          {/* <Headline>Étapes</Headline> */}
          {path.instructions.map((instruction, index) => (
            <InstructionItem
              isSelected={index === currentIndex}
              key={`instruction-${index}`}
              instruction={instruction}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
