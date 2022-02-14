import React, { ReactElement, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Caption, Headline } from 'react-native-paper';
import { getAll, POICategory } from '../actions/poi';
import ARFilter, { ARFilterItem } from '../components/atoms/ARFilter';
import Header from '../components/molecules/ARHeader';
import ARMapView from '../components/templates/ARMapView';
import SwitchToggle, {
  SwitchToggleItem
} from '../components/molecules/ARSwitchToggle';
import ARListView from '../components/templates/ARListView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headlineContainer: {
    flexDirection: 'row',
  },
  headline: {
    flex: 1,
    alignItems: 'stretch',
  },
});

const filters: ARFilterItem[] = [
  {label: 'Mes favoris', value: POICategory.FAVORITE},
  {label: 'Parcs', value: POICategory.PARK},
  {label: 'Sport', value: POICategory.SPORT},
  {label: 'Culture', value: POICategory.CULTURE},
  {label: 'Marché', value: POICategory.MARKET},
];

export default () => {
  const [displayTypeIndex, setDisplayTypeIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<POICategory[]>(
    [],
  );

  const pois = getAll(selectedCategories);

  const displayTypeItems: (SwitchToggleItem & {render: () => ReactElement})[] =
    [
      {
        key: 'map',
        icon: 'map',
        render: () => <ARMapView pois={pois} />,
      },
      {
        key: 'list',
        icon: 'list',
        render: () => <ARListView />,
      },
    ];

  return (
    <>
      <Header>
        <SafeAreaView>
          <View style={styles.headlineContainer}>
            <Headline style={styles.headline}>Les points d'intérêts</Headline>
            <SwitchToggle
              onChange={setDisplayTypeIndex}
              activeIndex={displayTypeIndex}
              items={displayTypeItems}
              activeColor="#4863f1"
            />
          </View>

          <Caption>Découvrez la qualité de l'air en temps réel</Caption>

          <ARFilter
            items={filters}
            multiple
            onChange={items => {
              setSelectedCategories(items.map(item => item.value));
            }}
          />
        </SafeAreaView>
      </Header>
      <SafeAreaView style={styles.container}>
        {displayTypeItems[displayTypeIndex].render()}
      </SafeAreaView>
    </>
  );
};
