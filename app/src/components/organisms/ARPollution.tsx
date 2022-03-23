import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import { QAType, QATypes, QAValues } from '../../actions/qa';
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

export default () => {
  const particles = [
    {
      title: 'Particles PM 10',
      indice: 5,
    },
    {
      title: 'Particles PM 2.5',
      indice: 4,
    },
    {
      title: 'Ozone',
      indice: 3,
    },
    {
      title: "Dioxyde d'azote",
      indice: 2,
    },
    {
      title: 'Dioxyde de soufre',
      indice: 1,
    },
  ];
  return (
    <View>
      <Title style={styles.title}>Détail</Title>

      {particles.map(({ indice, title }) => (
        <Particle title={title} value={QAValues[indice]} />
      ))}
      <Text style={styles.legendText}>
        Chaque jour la qualité de l’air est définie par le(s) polluant(s) le(s)
        plus problématique(s) du jour.
      </Text>
    </View>
  );
};
