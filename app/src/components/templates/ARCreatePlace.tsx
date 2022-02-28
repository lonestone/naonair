import { useNavigation } from '@react-navigation/native';
import { Position } from 'geojson';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { setPlaceStorage } from '../../actions/myplaces';
import { MapboxFeature, POI, POICategory } from '../../actions/poi';
import useSnackbar from '../../contexts/snackbar.context';
import { theme } from '../../theme';
import { StackNavigationScreenProp } from '../../types/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARAddressInput from '../molecules/ARAddressInput';
import ARListItem from '../molecules/ARListItem';
import { icons } from './ARMapView';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  input: {
    marginHorizontal: 15,
    marginVertical: 5,
    color: theme.colors.blue[400],
  },
});

const ARCreatePlace = () => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  const { setSnackbarStatus } = useSnackbar();

  const [name, setName] = useState('');
  const [place, setPlace] = useState<POI>();
  const [results, setResults] = useState<MapboxFeature[]>([]);
  const [values, setValues] = useState<
    { coord: Position; text: string } | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnsubmit = async () => {
    setIsLoading(true);
    await setPlaceStorage(place!);
    navigation.goBack();
    setSnackbarStatus?.({
      isVisible: true,
      label: "L'adresse a été enregistrée",
      icon: 'check-circle',
      backgroundColor: theme.colors.quality.main.green,
    });
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
        style={styles.input}
        outlineColor={theme.colors.blue[400]}
        placeholderTextColor={theme.colors.blue[400]}
      />
      <ARAddressInput
        label="Adresse"
        placeholder="Adresse"
        onResults={setResults}
        value={values}
        style={styles.input}
      />
      <ScrollView
        style={styles.container}
        contentInset={{ bottom: 70, top: -50 }}
        indicatorStyle="black">
        {(results || []).map(({ properties, geometry, text_fr }, index) => (
          <React.Fragment key={index}>
            <ARListItem
              key={properties?.id}
              title={text_fr}
              leftIcon={() => (
                <SvgXml
                  width="20"
                  height="20"
                  xml={icons[`${POICategory.MY_PLACES}`]}
                />
              )}
              onPress={() => {
                setValues({
                  coord: geometry.coordinates,
                  text: text_fr,
                });
                setPlace({
                  id: new Date().getTime(),
                  adress: text_fr,
                  category: POICategory.MY_PLACES,
                  name,
                  geolocation: properties?.geolocation,
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
