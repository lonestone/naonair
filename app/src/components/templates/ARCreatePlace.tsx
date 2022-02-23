import { Feature, Point, Position } from 'geojson';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { POICategory } from '../../actions/poi';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARAddressInput from '../molecules/ARAddressInput';
import ARListItem from '../molecules/ARListItem';
import { icons } from './ARMapView';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});

const ARCreatePlace = () => {
  const [name, setName] = useState('');
  const [results, setResults] = useState<Feature[]>([]);
  const [values, setValues] = useState<Position | undefined>();

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
              title={properties?.name}
              description={properties?.adress}
              leftIcon={() => (
                <SvgXml width="20" height="20" xml={icons[`${POICategory.MY_PLACES}`]} />
              )}
              onPress={() => {
                setValues((geometry as Point).coordinates);
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
        onPress={() => console.log(name, values)}
      />
    </View>
  );
};

export default ARCreatePlace;
// poi={{
//     id: properties?.id,
//     name: properties?.name,
//     adress: properties?.label,
//     category: POICategory.CULTURE,
//     geolocation: {
//       lat: (geometry as Point).coordinates[0],
//       lon: (geometry as Point).coordinates[1],
//     },
//   }}
