import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Text } from 'react-native-paper';
import { fonts, theme } from '@theme';
import ARForecastChart from '@molecules/ARForecastChart';
import { Forecast } from '../../actions/qa';

const styles = StyleSheet.create({
  container: { paddingTop: 18 },
  title: {
    fontSize: 18,
    color: theme.colors.blue[500],
    ...fonts.Raleway.bold,
    lineHeight: 24,
  },
  card: {
    minHeight: 150,
    backgroundColor: theme.colors.accent,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.blue[400],
  },
  subtext: {
    textAlign: 'center',
    color: theme.colors.blue[400],
    marginTop: 30,
    ...fonts.Lato.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  listItem: {
    padding: 0,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

interface Props {
  indices: Forecast[];
  isLoading: boolean;
  error: any;
}

const ARForecasts = ({ indices, isLoading, error }: Props) => {
  return (
    <View style={styles.container}>
      <List.Item
        style={styles.listItem}
        titleStyle={styles.title}
        title="Prévisions"
      />
      {isLoading && (
        <View style={styles.card}>
          <ActivityIndicator size="large" animating />
        </View>
      )}
      {indices.length > 0 && <ARForecastChart indices={indices} />}
      {error && (
        <View style={styles.card}>
          <Text style={styles.text}>non disponible pour ce lieu</Text>
        </View>
      )}
    </View>
  );
};

export default ARForecasts;
