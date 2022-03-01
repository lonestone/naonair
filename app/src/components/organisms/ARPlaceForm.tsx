import { Position } from 'geojson';
import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MapboxFeature } from '../../actions/poi';
import { theme } from '../../theme';
import ARAddressInput from '../molecules/ARAddressInput';

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 15,
    marginVertical: 5,
    color: theme.colors.blue[400],
    backgroundColor: 'white',
  },
});

interface ARPlaceFormProps {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  values?: {
    coord: Position;
    text: string;
  };
  setValues: Dispatch<
    SetStateAction<
      | {
          coord: Position;
          text: string;
        }
      | undefined
    >
  >;
  setResults: Dispatch<SetStateAction<MapboxFeature[]>>;
}

const ARPlaceForm = ({
  name,
  setName,
  values,
  setValues,
  setResults,
}: ARPlaceFormProps) => {
  return (
    <View>
      <TextInput
        label="Titre"
        placeholder="Titre"
        value={name}
        mode="outlined"
        onChangeText={setName}
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
    </View>
  );
};

export default ARPlaceForm;
