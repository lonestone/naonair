import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { getAllPlaces } from '../../actions/myplaces';
import { POI, POICategory } from '../../actions/poi';
import { theme } from '../../theme';
import { StackNavigationScreenProp } from '../../types/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARSnackbar from '../atoms/ARSnackbar';
import ARListItem from '../molecules/ARListItem';

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
  const [items, setItems] = useState<POI[]>();

  const readItemFromStorage = async () => {
    const values = await getAllPlaces();
    if (values) {
      try {
        setItems(Array.isArray(values) ? values : [values]);
      } catch (e) {
        console.error(e);
        console.error(values);
      }
    }
  };

  useEffect(() => {
    navigation.addListener('focus', readItemFromStorage);
    return () => navigation.removeListener('focus', readItemFromStorage);
  }, [navigation]);

  return (
    <>
      <ARSnackbar />
      <ScrollView style={styles.container}>
        {items && items.length > 0 ? (
          items.map(poi => (
            <ARListItem
              key={`poi-${poi.id}`}
              title={poi.name}
              description={poi.address}
              descriptionStyle={styles.description}
              titleStyle={styles.title}
              onPress={() =>
                poi.category === POICategory.FAVORITE &&
                navigation.navigate('PlaceForm', { poi })
              }
              category={poi.category}
              // leftIcon={() => (
              //   <View style={styles.iconWrapper}>
              //     <SvgXml
              //       width="20"
              //       height="20"
              //       xml={poiIcons[`${poi.category}`] || null}
              //       fill={theme.colors.blue[500]}
              //     />
              //   </View>
              // )}
              rightIcon={
                poi.category === POICategory.FAVORITE ? 'pencil' : 'star'
              }
            />
          ))
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
