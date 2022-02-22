import { eachHourOfInterval, startOfTomorrow } from 'date-fns';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { theme } from '../../theme';
import { ForecastColor } from '../../types/forecasts';
import ARChartPie from '../atoms/ARChartPie';

const styles = StyleSheet.create({
  container: {
    minWidth: 350,
    borderColor: theme.colors.accent,
    borderWidth: 1,
    marginTop: 15,
  },
});

// TODO : exemple de tableau avec pour les heures le type de qa

const ARForecastChart = () => {
  const intervalOfHours = eachHourOfInterval({
    start: new Date(),
    end: startOfTomorrow()
  })

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {intervalOfHours.map((hour, i) => (
          <ARChartPie key={i}  qa={{hour, color: ForecastColor.GOOD}} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ARForecastChart;
