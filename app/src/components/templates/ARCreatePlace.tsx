import { useNavigation } from '@react-navigation/native';
import { Feature, Point, Position } from 'geojson';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { setPlaceStorage } from '../../actions/myplaces';
import { POI, POICategory } from '../../actions/poi';
import { NavigationScreenProp } from '../../types/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARAddressInput from '../molecules/ARAddressInput';
import ARListItem from '../molecules/ARListItem';
import { icons } from './ARMapView';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});

const ARCreatePlace = () => {
  const navigation = useNavigation<NavigationScreenProp>();

  const [name, setName] = useState('');
  const [place, setPlace] = useState<POI>();
  const [results, setResults] = useState<Feature[]>([]);
  const [values, setValues] = useState<Position | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnsubmit = async () => {
    setIsLoading(true);
    await setPlaceStorage(place!);
    navigation.goBack();
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Titre"
        placeholder="Titre"
        value={name}
        mode="outlined"
        onChangeText={text => setName(text)}
      />
      <ARAddressInput
        label="Adresse"
        placeholder="Adresse"
        value={values}
        onResults={setResults}
      />
      <ScrollView
        style={styles.container}
        contentInset={{ bottom: 70, top: -50 }}
        indicatorStyle="black">
        {(results || []).map(({ properties, geometry }) => (
          <React.Fragment key={properties?.id}>
            <ARListItem
              title={properties?.label}
              leftIcon={() => (
                <SvgXml
                  width="20"
                  height="20"
                  xml={icons[`${POICategory.MY_PLACES}`]}
                />
              )}
              onPress={() => {
                setValues((geometry as Point).coordinates);
                setPlace({
                  id: new Date().getTime(),
                  adress: properties?.label,
                  category: POICategory.MY_PLACES,
                  name,
                  geolocation: { lat: properties?.x, lon: properties?.y },
                });
                setResults([]);
              }}
            />
          </React.Fragment>
        ))}
      </ScrollView>
      <ARButton
        label="Enregistrer"
        size={ARButtonSize.Medium}
        styleContainer={{
          margin: 40,
          flex: 0,
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
        }}
        onPress={handleOnsubmit}
        disabled={!place}
        loading={isLoading}
      />
    </View>
  );
};

export default ARCreatePlace;
