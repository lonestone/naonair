import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme';
import { useCarbonEquivalent } from '../../hooks/useCarbonEquivalent';

type ARCarbonEquivalentProps = {
  distance: number;
} & ViewProps;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  textContainer: {
    display: 'flex',
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    color: 'white',
  },
});

export default ({ distance, ...props }: ARCarbonEquivalentProps) => {
  const { carbonEquivalent, error, isLoading } = useCarbonEquivalent(distance);

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <View style={[styles.container, props.style]}>
      {isLoading && <ActivityIndicator color="white" />}
      {!isLoading && (
        <View style={styles.textContainer}>
          <Icon name="lightbulb-on-outline" size={18} color="white" />
          <Text style={styles.text}>
            En voiture, vous auriez émis {carbonEquivalent.toFixed(2)} kg de CO2
          </Text>
        </View>
      )}
    </View>
  );
};
