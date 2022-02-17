import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { ReactElement, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Caption, Headline } from 'react-native-paper';
import { getAll, POICategory } from '../actions/poi';
import ARFilter, { ARFilterItem } from '../components/atoms/ARFilter';
import Header from '../components/molecules/ARHeader';
import SwitchToggle, {
  SwitchToggleItem
} from '../components/molecules/ARSwitchToggle';
import ARListView from '../components/templates/ARListView';
import ARMapView from '../components/templates/ARMapView';
import ARPOIDetails from '../components/templates/ARPOIDetails';
import { theme } from '../theme';

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
  const Stack = createNativeStackNavigator();

  const pois = getAll(selectedCategories);

  const displayTypeItems: (SwitchToggleItem & {render: () => ReactElement})[] =
    [
      {
        key: 'map',
        icon: 'map',
        render: () => (
          <Stack.Screen name="Map">
            {() => <ARMapView pois={pois} />}
          </Stack.Screen>
        ),
      },
      {
        key: 'list',
        icon: 'list',
        render: () => (
          <Stack.Screen name="List">
            {() => <ARListView pois={pois} />}
          </Stack.Screen>
        ),
      },
    ];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator
          screenOptions={{contentStyle: {backgroundColor: 'white'}}}>
          <Stack.Group
            screenOptions={{
              header: ({}) => {
                return (
                  <Header>
                    <SafeAreaView>
                      <View style={styles.headlineContainer}>
                        <Headline style={styles.headline}>
                          Les points d'intérêts
                        </Headline>
                        <SwitchToggle
                          onChange={setDisplayTypeIndex}
                          activeIndex={displayTypeIndex}
                          items={displayTypeItems}
                          activeColor={theme.colors.primary}
                        />
                      </View>

                      <Caption>
                        Découvrez la qualité de l'air en temps réel
                      </Caption>

                      <ARFilter
                        items={filters}
                        multiple
                        onChange={items => {
                          setSelectedCategories(items.map(item => item.value));
                        }}
                      />
                    </SafeAreaView>
                  </Header>
                );
              },
            }}>
            {displayTypeItems[displayTypeIndex].render()}
          </Stack.Group>
          <Stack.Screen
            name="Details"
            component={ARPOIDetails}
            options={{headerTitle: 'Détail'}}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </>
  );
};
