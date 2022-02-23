import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../theme';
import { ForecastType } from '../../types/forecasts';

const styles = StyleSheet.create({
  container: { padding: 15, alignItems: 'center' },
  hour: {
    marginBottom: 10,
    color: theme.colors.blue[400],
  },
});

interface Props {
  qa: ForecastType;
}

const ARChartPie = ({ qa }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.hour}>{format(qa.hour, 'HH:mm')}</Text>
      <Svg height="16" width="16">
        <Circle cx="8" cy="8" r="8" fill={qa.color} />
      </Svg>
    </View>
  );
};

export default ARChartPie;
