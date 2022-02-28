import { useNavigation } from '@react-navigation/native';
import React, {
  useEffect, useState
} from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getAllPlaces } from '../../actions/myplaces';
import { POI, POICategory } from '../../actions/poi';
import { theme } from '../../theme';
import { StackNavigationScreenProp } from '../../types/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARSnackbar from '../atoms/ARSnackbar';
import ARListItem from '../molecules/ARListItem';
import { icons } from './ARMapView';

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
});

const favorites: POI[] = [
  {
    id: 1,
    adress: 'Rue Stanislas Baudry, 44000 Nantes',
    category: POICategory.MY_PLACES,
    name: 'Ici la',
    geolocation: [0, 0],
  },
  {
    id: 2,
    adress: 'Rue Général de Gaulle, 44000 Nantes',
    category: POICategory.CULTURE,
    name: 'Le musée',
    geolocation: [0, 0],
  },
];

const ARListFavorites = () => {

  const navigation = useNavigation<StackNavigationScreenProp>();
  const [items, setItems] = useState<POI[]>([]);

  const readItemFromStorage = async () => {
    const values = await getAllPlaces();
    setItems(values?.concat(favorites) || favorites);
  };

  useEffect(() => {
    navigation.addListener('focus', readItemFromStorage);
    return () => navigation.removeListener('focus', readItemFromStorage);
  }, []);

  return (
    <>
      <ARSnackbar />
      <ScrollView style={styles.container}>
        {items &&
          items.map((fav, idx) => (
            <ARListItem
              key={`fav-${idx}`}
              title={fav.name}
              description={fav.adress}
              descriptionStyle={styles.description}
              titleStyle={styles.title}
              onPress={() =>
                fav.category === POICategory.MY_PLACES &&
                console.log('TODO', fav)
              }
              leftIcon={() => (
                <View style={styles.iconWrapper}>
                  <SvgXml
                    width="20"
                    height="20"
                    xml={icons[`${fav.category}`]}
                    fill={theme.colors.blue[500]}
                  />
                </View>
              )}
              rightIcon={
                fav.category === POICategory.MY_PLACES ? 'pencil' : 'star'
              }
            />
          ))}
      </ScrollView>
      <ARButton
        icon="plus"
        label="Créer une adresse"
        size={ARButtonSize.Medium}
        styleContainer={styles.button}
        onPress={() => {
          navigation.navigate('CreatePlace');
        }}
      />
    </>
  );
};

export default ARListFavorites;
