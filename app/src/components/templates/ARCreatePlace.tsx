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
    backgroundColor: 'white',
  },
  button: {
    margin: 40,
    flex: 0,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});

const ARCreatePlace = () => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  const { setSnackbarStatus } = useSnackbar();

  const [name, setName] = useState('');
  const [results, setResults] = useState<MapboxFeature[]>([]);
  const [values, setValues] = useState<
    { coord: Position; text: string } | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnsubmit = async () => {
    if (values) {
      setIsLoading(true);

      await setPlaceStorage({
        id: new Date().getTime(),
        adress: values?.text,
        category: POICategory.MY_PLACES,
        name,
        geolocation: values?.coord,
      });

      navigation.goBack();

      setSnackbarStatus?.({
        isVisible: true,
        label: "L'adresse a été enregistrée",
        icon: 'check-circle',
        backgroundColor: theme.colors.quality.main.green,
      });
      setIsLoading(false);
    }
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
        onUserLocation={(coord, text) => {
          setValues({ coord, text });
        }}
        value={values}
        style={styles.input}
      />
      <ScrollView
        style={styles.container}
        contentInset={{ bottom: 70, top: -50 }}
        indicatorStyle="black">
        {(results || []).map(({ geometry, text_fr }, index) => (
          <React.Fragment key={index}>
            <ARListItem
              key={`item-${index}`}
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
                setResults([]);
              }}
            />
          </React.Fragment>
        ))}
      </ScrollView>
      <ARButton
        label="Enregistrer"
        size={ARButtonSize.Medium}
        styleContainer={styles.button}
        onPress={handleOnsubmit}
        disabled={
          !values || values.coord.length === 0 || !name || name.length === 0
        }
        loading={isLoading}
      />
    </View>
  );
};

export default ARCreatePlace;
