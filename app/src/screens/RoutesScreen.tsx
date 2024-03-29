import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fonts, theme } from '../theme';
import ARRoutesList from '../components/templates/ARRoutesList';
import ARFilter, { ARFilterItem } from '../components/molecules/ARFilter';
import ARHeader from '../components/atoms/ARHeader';
import { Caption, Headline } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ParcoursCategory } from '../actions/parcours';

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
    fontSize: 21,
    lineHeight: 24,
    color: theme.colors.blue[500],
    ...fonts.Raleway.bold,
  },
  caption: {
    fontSize: 14,
    color: theme.colors.blue[300],
    ...fonts.Lato.regular,
    lineHeight: 20,
  },
});

export const ROUTE_FILTERS: ARFilterItem<ParcoursCategory>[] = [
  {
    label: 'Mes favoris',
    value: ParcoursCategory.FAVORITE,
    icon: selected => (
      <CommunityIcon
        size={20}
        color={selected ? 'white' : theme.colors.blue[500]}
        name="star"
      />
    ),
  },
  {
    label: 'Promenades',
    value: ParcoursCategory.WALK,
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
    value: ParcoursCategory.BIKE,
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
    value: ParcoursCategory.RUNNING,
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
  const [selectedFilters, setSelectedFilters] = useState<ParcoursCategory[]>(
    [],
  );
  const { left, right } = useSafeAreaInsets();

  return (
    <>
      <ARHeader>
        <>
          <Headline style={styles.headline}>Les parcours</Headline>
          <Caption style={styles.caption}>
            Retrouvez des suggestions de promenades et d’itinéraires sportifs
            basés sur la qualité de l’air
          </Caption>
          <ARFilter<ParcoursCategory>
            items={ROUTE_FILTERS}
            multiple
            style={{
              marginLeft: -18 - left,
              marginRight: -18 - right,
              paddingLeft: 18 + left,
            }}
            contentInset={{ right: 18 + right }}
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
