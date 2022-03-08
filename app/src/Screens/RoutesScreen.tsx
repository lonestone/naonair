import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fonts, theme } from '../theme';
import ARRoutesList from '../components/templates/ARRoutesList';
import ARFilter, { ARFilterItem } from '../components/molecules/ARFilter';
import ARHeader from '../components/atoms/ARHeader';
import { Caption, Headline } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headlineContainer: {
    flexDirection: 'row',
  },
  headline: {
    flex: 0,
    alignItems: 'stretch',
    fontSize: 20,
    lineHeight: 24,
    color: theme.colors.blue[500],
    ...fonts.Raleway.bold,
  },
  caption: {
    ...fonts.Lato.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});

const filters: ARFilterItem[] = [
  {
    label: 'Promenades',
    value: 'marcheur',
    icon: selected => (
      <Icon
        size={20}
        color={selected ? 'white' : theme.colors.blue[500]}
        name="walk"
      />
    ),
  },
  {
    label: 'Vélo',
    value: 'cycliste',
    icon: selected => (
      <Icon
        size={20}
        color={selected ? 'white' : theme.colors.blue[500]}
        name="bike"
      />
    ),
  },
  {
    label: 'Course',
    value: 'coureur',
    icon: selected => (
      <Icon
        size={20}
        color={selected ? 'white' : theme.colors.blue[500]}
        name="run"
      />
    ),
  },
];

export default () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <>
      <ARHeader>
        <>
          <Headline style={styles.headline}>Les parcours</Headline>
          <Caption style={styles.caption}>
            Retrouvez des suggestions de promenades et d’itinéraires sportifs
            basés sur la qualité de l’air
          </Caption>
          <ARFilter
            items={filters}
            multiple
            onChange={items => {
              setSelectedFilters(items.map(i => i.value));
            }}
          />
        </>
      </ARHeader>
      <SafeAreaView style={styles.container}>
        <ARRoutesList filters={selectedFilters} />
      </SafeAreaView>
    </>
  );
};
