import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { POI, POICategory } from '../../actions/poi';
import { theme } from '../../theme';
import ARListItem from '../molecules/ARListItem';
import { icons } from './ARMapView';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white' },
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
});

const favorites: POI[] = [
  {
    id: 1,
    adress: 'Rue Stanislas Baudry, 44000 Nantes',
    category: POICategory.MY_PLACES,
    name: 'Ici la',
    geolocation: { lat: 0, lon: 0 },
  },
  {
    id: 2,
    adress: 'Rue Général de Gaulle, 44000 Nantes',
    category: POICategory.CULTURE,
    name: 'Le musée',
    geolocation: { lat: 0, lon: 0 },
  },
];

const ARListFavorites = () => {

  return (
    <ScrollView style={styles.container}>
      {favorites.map((fav, idx) => (
        <ARListItem
          key={idx}
          title={fav.name}
          description={fav.adress}
          descriptionStyle={styles.description}
          titleStyle={styles.title}
          onPress={() => console.log("TODO",fav)}
          leftIcon={() => (
            <SvgXml width="20" height="20" xml={icons[`${fav.category}`]} />
          )}
          rightIcon={fav.category === POICategory.MY_PLACES ? 'pencil' : 'star'}
        />
      ))}
    </ScrollView>
  );
};

export default ARListFavorites;