import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import { Forecast, forecast } from '../../actions/qa';
import { fonts, theme } from '../../theme';
import ARForecastChart from '../molecules/ARForecastChart';

const styles = StyleSheet.create({
  container: { paddingTop: 25 },
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
  // TODO: add real type from received datas
  forecastQA?: boolean;
  id: number;
}

const ARForecasts = ({ forecastQA, id }: Props) => {
  const [indices, setIndices] = useState<Forecast[]>([]);
  useEffect(() => {
    forecast(id).then(setIndices);
  }, [id]);

  return (
    <View style={styles.container}>
      <List.Item
        style={styles.listItem}
        titleStyle={styles.title}
        title="Prévisions"
      />
      {forecastQA ? (
        <ARForecastChart indices={indices} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.text}>non disponible pour ce lieu</Text>
        </View>
      )}
      <Text style={styles.subtext}>mise à jour le 10/01/222</Text>
    </View>
  );
};

export default ARForecasts;
