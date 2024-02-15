import { PollenDTO } from '@aireal/dtos';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts, theme } from '../../theme';

interface ARPollenStateRowProps {
  pollen: PollenDTO;
  stateName: string;
}

const ARPollenStateRow = ({ pollen, stateName }: ARPollenStateRowProps) => {
  const stateColor = useMemo(() => {
    switch (pollen.state) {
      case 0:
        return theme.colors.quality.main.green;
      case 1:
        return theme.colors.quality.main.red;
      case 9:
        return 'transparent';
      case 2:
      case 8:
      default:
        return theme.colors.grey[200];
    }
  }, [pollen.state]);
  const stateTextColor = useMemo(() => {
    switch (pollen.state) {
      case 1:
        return theme.colors.white;
      case 0:
      case 9:
      case 2:
      case 8:
      default:
        return 'black';
    }
  }, [pollen.state]);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{pollen.name}</Text>
      </View>
      <View style={[styles.stateContainer, { backgroundColor: stateColor }]}>
        <Text style={[styles.state, { color: stateTextColor }]}>
          {stateName.charAt(0).toUpperCase() + stateName.slice(1)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingRight: 16,
    marginLeft: 40,
    borderColor: theme.colors.accent,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    ...fonts.Lato.regular,
    fontSize: 16,
    lineHeight: 24,
    textTransform: 'capitalize',
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    width: 100,
  },
  state: {
    ...fonts.Lato.bold,
    color: 'black',
    fontSize: 10,
    lineHeight: 10,
  },
});

export default ARPollenStateRow;
