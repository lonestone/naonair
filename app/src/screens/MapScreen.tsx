import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';
import { getAll, POI, POICategory } from '../actions/poi';
import { SwitchToggleItem } from '../components/molecules/ARSwitchToggle';
import ARPOIHeader from '../components/organisms/ARPOIHeader';
import ARAlert from '../components/templates/ARAlert';
import ARListView from '../components/templates/ARListView';
import ARMapView from '../components/templates/ARMapView';
import ARNews from '../components/templates/ARNews';
import { TabNavigationScreenProp } from '../types/routes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default () => {
  const [displayTypeIndex, setDisplayTypeIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<POICategory[]>();
  const [pois, setPois] = useState<POI[]>([]);
  const navigation = useNavigation<TabNavigationScreenProp>();

  const generateListOfPOIs = useCallback(async () => {
    const _pois = await getAll({ categories: selectedCategories });
    setPois(_pois);
  }, [selectedCategories]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', generateListOfPOIs);
    return unsubscribe;
  }, [navigation, generateListOfPOIs]);

  useEffect(() => {
    generateListOfPOIs();
  }, [selectedCategories]);

  const displayTypeItems: (SwitchToggleItem & {
    render: () => ReactElement;
  })[] = [
    {
      key: 'map',
      icon: 'map',
      render: () => <ARMapView pois={pois} />,
    },
    {
      key: 'list',
      icon: 'list',
      render: () => <ARListView pois={pois} category={selectedCategories} />,
    },
  ];

  return (
    <>
      <Portal>
        <ARNews />
      </Portal>
      <ARPOIHeader
        displayTypeIndex={displayTypeIndex}
        displayTypeItems={displayTypeItems}
        setDisplayTypeIndex={setDisplayTypeIndex}
        setSelectedCategories={items => {
          setSelectedCategories(items);
        }}
      />
      <ARAlert />
      <SafeAreaView style={styles.container}>
        {displayTypeItems[displayTypeIndex].render()}
      </SafeAreaView>
    </>
  );
};
