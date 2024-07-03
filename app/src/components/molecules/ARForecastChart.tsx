import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Forecast } from '../../actions/qa';
import { theme } from '@theme';
import ARChartPie from '../atoms/ARChartPie';

const styles = StyleSheet.create({
  container: {
    minWidth: 350,
    borderColor: theme.colors.accent,
    borderWidth: 1,
    borderRadius: 4,
  },
});

export interface ARForecastChartProps {
  indices: Forecast[];
}

const ARForecastChart = ({ indices }: ARForecastChartProps) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {indices.map(({ hour, value }, i) => (
          <ARChartPie key={i} qa={{ hour, color: value.main }} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ARForecastChart;
