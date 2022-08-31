import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { removeFromFavorites } from '../../actions/favorites';
import {
  ARParcours,
  getAll as getAllParcours,
  ParcoursCategory,
} from '../../actions/parcours';
import { getAll as getAllPOIs, POI, POICategory } from '../../actions/poi';
import { theme } from '../../theme';
import { StackNavigationScreenProp } from '../../types/routes';
import logger from '../../utils/logger';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARSnackbar from '../atoms/ARSnackbar';
import ARFilter, { ARFilterItem } from '../molecules/ARFilter';
import ARListItemParcours from '../organisms/ARListItemParcours';
import ARListItemPOI from '../organisms/ARListItemPOI';
import BackButton from '../molecules/ARBackButton';
import ARCommonHeader from '../molecules/ARCommonHeader';

// eslint-disable-next-line no-shadow
export enum FavoritesType {
  POIS = 'pois',
  PARCOURS = 'parcours',
}

const FAVORITES_FILTERS: ARFilterItem<FavoritesType>[] = [
  {
    label: "Points d'intérêts",
    value: FavoritesType.POIS,
    selected: true,
  },
  {
    label: 'Parcours sportifs',
    value: FavoritesType.PARCOURS,
  },
];

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
  description: {
    color: theme.colors.blue[300],
    lineHeight: 24,
    fontSize: 12,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.blue[500],
    fontSize: 16,
  },
  button: {
    margin: 40,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
  },
  paragraph: {
    marginHorizontal: 20,
    marginTop: 10,
    color: theme.colors.blue[500],
  },
});

const ARListFavorites = () => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const { left, right } = useSafeAreaInsets();
  const [items, setItems] = useState<(POI | ARParcours)[]>();
  const [filter, setFilter] = useState<FavoritesType>(FavoritesType.POIS);

  const readItemFromStorage = async () => {
    try {
      let myPOIs: POI[] = [];
      let myParcours: ARParcours[] = [];
      Promise.all([
        getAllPOIs({ categories: [POICategory.FAVORITE] }),
        getAllParcours([ParcoursCategory.FAVORITE]),
      ]).then(values => {
        myPOIs = values[0];
        myParcours = values[1];
        setItems([...myPOIs, ...myParcours]);
      });
    } catch (e) {
      logger.error(e, 'getALlFavorites');
    }
  };

  useEffect(() => {
    navigation.addListener('focus', readItemFromStorage);
    return () => navigation.removeListener('focus', readItemFromStorage);
  }, [navigation]);

  const handleRemove = (item: POI | ARParcours) => {
    removeFromFavorites(item);
    readItemFromStorage();
  };

  const filteredItems = useMemo(
    () =>
      items?.filter(item =>
        filter === FavoritesType.PARCOURS ? 'properties' in item : 'id' in item,
      ),
    [items, filter],
  );

  return (
    <>
      <ARCommonHeader headline="Mes favoris" left={<BackButton />}>
        <ARFilter<FavoritesType>
          items={FAVORITES_FILTERS}
          style={{
            marginRight: -right - 18,
            marginLeft: -left - 18,
            paddingLeft: left + 15,
          }}
          contentInset={{ right: right + 18 }}
          onChange={list => {
            const value = list.map(i => i.value)[0];
            setFilter(value);
          }}
        />
      </ARCommonHeader>
      <ARSnackbar />
      <ScrollView style={styles.container}>
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map(item =>
            'id' in item ? (
              <ARListItemPOI
                key={`poi-${item.id}`}
                poi={item}
                descriptionStyle={styles.description}
                titleStyle={styles.title}
                onPress={() =>
                  item.category === POICategory.FAVORITE
                    ? navigation.navigate('PlaceForm', { poi: item })
                    : handleRemove(item)
                }
              />
            ) : (
              <ARListItemParcours
                key={`parcours-${item.properties.id}`}
                parcours={item}
                descriptionStyle={styles.description}
                titleStyle={styles.title}
                onPress={() => handleRemove(item)}
              />
            ),
          )
        ) : (
          <View style={styles.paragraph}>
            <Paragraph>Vous n'avez aucune adresse ici.</Paragraph>
          </View>
        )}
      </ScrollView>
      <ARButton
        icon="plus"
        label="Créer une adresse"
        size={ARButtonSize.Medium}
        styleContainer={styles.button}
        onPress={() => {
          navigation.navigate('PlaceForm');
        }}
      />
    </>
  );
};

export default ARListFavorites;
