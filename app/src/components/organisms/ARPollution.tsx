import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import { POI } from '../../actions/poi';
import { QAType, QAValues } from '../../actions/qa';
import { fonts, theme } from '../../theme';
import ARQAChip from '../atoms/ARQAChip';

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
    marginTop: 24,
  },
  particleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  particleLabel: {
    flex: 1,
    color: theme.colors.blue[500],
    fontSize: 14,
    lineHeight: 20,
    ...fonts.Lato.regular,
  },
  legendText: {
    fontSize: 10,
    lineHeight: 16,
    color: theme.colors.blue[200],
    ...fonts.Lato.bold,
    marginTop: 9,
    marginBottom: 30,
  },
});

const Particle = ({ title, value }: { title: string; value: QAType }) => (
  <View style={styles.particleContainer}>
    <Text style={styles.particleLabel}>{title}</Text>
    <ARQAChip value={value} size="sm" />
  </View>
);

export type ARPollutionProps = {
  poi: POI;
};

export default ({ poi }: ARPollutionProps) => {
  const particles = [
    {
      key: 'pm10_indice',
      title: 'Particles PM 10',
    },
    {
      key: 'pm25_indice',
      title: 'Particles PM 2.5',
    },
    {
      key: 'o3_indice',
      title: 'Ozone',
    },
    {
      key: 'no2_indice',
      title: "Dioxyde d'azote",
    },
    {
      key: 'so2_indice',
      title: 'Dioxyde de soufre',
    },
  ];
  return (
    <View>
      <Title style={styles.title}>Détail</Title>

      {particles.map(({ title, key }) => (
        <Particle key={key} title={title} value={QAValues[poi[key]]} />
      ))}
      <Text style={styles.legendText}>
        Chaque jour la qualité de l’air est définie par le(s) polluant(s) le(s)
        plus problématique(s) du jour.
      </Text>
    </View>
  );
};
