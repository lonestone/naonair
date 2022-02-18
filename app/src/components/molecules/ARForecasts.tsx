import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {List, Text} from 'react-native-paper';
import {POI} from '../../actions/poi';
import {theme} from '../../theme';
import {Forecasts} from '../../types/forecasts';
import ARFilterItemComponent from '../atoms/ARFilterItemComponent';
import {ARFilterItem} from './ARFilter';

const styles = StyleSheet.create({
  container: {paddingTop: 25},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.blue[500],
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
});

const filters: ARFilterItem[] = [
  {label: "aujourd'hui", value: Forecasts.TODAY},
  {label: 'demain', value: Forecasts.TOMORROW},
];

interface Props {
  poi: POI;
}

const ARForecasts = ({poi}: Props) => {
  const [selectedFilter, setSelectedFilter] = useState(0);
  return (
    <View style={styles.container}>
      <List.Item
        titleStyle={styles.title}
        title="Prévisions"
        right={() => (
          <>
            {filters.map((f, idx) => (
              <ARFilterItemComponent
                key={idx}
                label={f.label}
                onPress={() => setSelectedFilter(f.value)}
                selected={f.value === selectedFilter}
              />
            ))}
          </>
        )}
      />
      <View style={styles.card}>
        <Text style={styles.text}>non disponible pour ce lieu</Text>
      </View>
    </View>
  );
};

export default ARForecasts;
