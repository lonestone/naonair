import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {theme} from '../../theme';
import { ForecastColor } from '../../types/forecasts';
import ARChartPie from '../atoms/ARChartPie';

const styles = StyleSheet.create({
  container: {
    minWidth: 350,
    borderColor: theme.colors.accent,
    borderWidth: 1,
    margin: 15,
  },
});

// TODO : exemple de tableau avec pour les heures le type de qa

const ARForecastChart = () => {
  const hours = Array.from(
    Array(24 - new Date().getHours()),
    (x, i) => ('0' + (23 - i)).slice(-2) + ':00',
  ).reverse();

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {hours.map((hour, i) => (
          <ARChartPie key={i}  qa={{hour, color: ForecastColor.GOOD}} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ARForecastChart;
