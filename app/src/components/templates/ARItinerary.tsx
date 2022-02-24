import { useNavigation } from '@react-navigation/native';
import { Position } from 'geojson';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MapboxFeature } from '../../actions/poi';
import { theme } from '../../theme';
import { StackNavigationScreenProp } from '../../types/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARHeader from '../atoms/ARHeader';
import ARAddressInput from '../molecules/ARAddressInput';
import ARFilter, { ARFilterItem } from '../molecules/ARFilter';
import ARListItem from '../molecules/ARListItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 0,
  },
  input: {
    flex: 0,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputs: {
    flex: 0,
  },
  icons: {},
  calculateButton: {
    margin: 40,
    flex: 0,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  iconInputs: {
    position: 'absolute',
    top: 70,
    left: -6,
  },
  geocodingIcon: {
    marginRight: 11,
  },
  geocodingInput: {
    marginVertical: 8,
    flex: 1,
  },
});

const filterItems: ARFilterItem[] = [
  {
    selected: true,
    label: 'Vélo',
    value: 'bike',
    icon: selected => (
      <Icon
        size={20}
        color={selected ? 'white' : theme.colors.blue[500]}
        name="directions-bike"
      />
    ),
  },
  {
    label: 'Vélo élec',
    value: 'elec-bike',
    icon: selected => (
      <Icon
        size={20}
        color={selected ? 'white' : theme.colors.blue[500]}
        name="electric-bike"
      />
    ),
  },
  {
    label: 'Marche',
    value: 'walk',
    icon: selected => (
      <Icon
        size={20}
        color={selected ? 'white' : theme.colors.blue[500]}
        name="directions-walk"
      />
    ),
  },
];

enum Field {
  START = 'start',
  END = 'end',
}
// [
//   -1.525139, 47.22919,
// ]
export default () => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const [results, setResults] = useState<MapboxFeature[]>([]);
  const [values, setValues] = useState<{
    [key: string]: { coord: Position; text: string } | undefined;
  }>({
    [Field.START]: {
      coord: [-1.525139, 47.22919],
      text: '20 route de sainte luce',
    },
    [Field.END]: { coord: [-1.560007, 47.206019], text: 'test' },
  });

  const [selectedField, setSelectedField] = useState<Field>(Field.START);

  const renderInput = (label: string, field: Field, iconName: string) => {
    return (
      <View style={styles.input}>
        <CommunityIcon
          style={styles.geocodingIcon}
          name={iconName}
          size={10}
          color={theme.colors.black[500]}
        />
        <ARAddressInput
          label={label}
          style={styles.geocodingInput}
          onResults={setResults}
          value={values[field]}
          onUserLocation={(coord, text) =>
            setValues({ ...values, [field]: { coord, text } })
          }
          onFocus={() => setSelectedField(field)}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      contentContainerStyle={styles.container}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={styles.container}>
        <View style={styles.container}>
          <ARHeader>
            <>
              <View style={styles.inputs}>
                {renderInput('Depuis', Field.START, 'circle-outline')}
                {renderInput('Vers', Field.END, 'circle')}
                <CommunityIcon
                  name="arrow-down"
                  style={styles.iconInputs}
                  size={21}
                  color={theme.colors.black[500]}
                />
              </View>
              <ARFilter items={filterItems} onChange={() => {}} />
            </>
          </ARHeader>

          <ScrollView
            style={styles.container}
            contentInset={{ bottom: 70, top: 0 }}
            indicatorStyle="black">
            {(results || []).map(({ properties, geometry, text_fr }) => (
              <ARListItem
                key={properties?.id}
                leftIcon="navigation"
                title={text_fr}
                onPress={() => {
                  setValues({
                    ...values,
                    [selectedField.toString()]: {
                      coord: geometry.coordinates,
                      text: text_fr,
                    },
                  });
                }}
              />
            ))}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      {values[Field.START] && values[Field.END] && (
        <ARButton
          label="Calculer mon itinéraire"
          size={ARButtonSize.Medium}
          styleContainer={styles.calculateButton}
          onPress={() => {
            navigation.navigate('ChooseItinerary', {
              start: values[Field.START]?.coord,
              end: values[Field.END]?.coord,
            });
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};
