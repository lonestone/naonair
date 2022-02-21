import {Feature, Point, Position} from 'geojson';
import React, {useState} from 'react';
import {Keyboard, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {POICategory} from '../../actions/poi';
import {theme} from '../../theme';
import {ARButton, ARButtonSize} from '../atoms/ARButton';
import ARHeader from '../atoms/ARHeader';
import ARFilter, {ARFilterItem} from '../molecules/ARFilter';
import ARGeocoding from '../molecules/ARGeocoding';
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
  const [results, setResults] = useState<Feature[]>([]);
  const [values, setValues] = useState<{[key: string]: Position | undefined}>({
    [Field.START]: [-1.525139, 47.22919],
  });

  const [selectedField, setSelectedField] = useState<Field>(Field.START);

  const renderInput = (label: string, field: Field, iconName: string) => {
    return (
      <View style={styles.input}>
        <Icon
          style={styles.geocodingIcon}
          name={iconName}
          size={10}
          color={theme.colors.black[500]}
        />
        <ARGeocoding
          label={label}
          style={styles.geocodingInput}
          onResults={setResults}
          value={values[field]}
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
        style={styles.container}
        containerStyle={styles.container}>
        <View style={styles.container}>
          <ARHeader>
            <>
              <View style={styles.inputs}>
                {renderInput('Depuis', Field.START, 'circle-outline')}
                {renderInput('Vers', Field.END, 'circle')}
                <Icon
                  name="arrow-down"
                  style={styles.iconInputs}
                  size={21}
                  color={theme.colors.black[500]}
                />
              </View>
              <ARFilter items={filterItems} onChange={() => {}} />
            </>
          </ARHeader>

          <ScrollView style={styles.container} indicatorStyle="black">
            {(results || []).map(({properties, geometry}) => (
              <React.Fragment key={properties?.id}>
                <ARListItem
                  poi={{
                    id: properties?.id,
                    name: properties?.name,
                    adress: properties?.label,
                    category: POICategory.CULTURE,
                    geolocation: {
                      lat: (geometry as Point).coordinates[0],
                      lon: (geometry as Point).coordinates[1],
                    },
                  }}
                  onPress={() => {
                    setValues({
                      ...values,
                      [selectedField.toString()]: (geometry as Point)
                        .coordinates,
                    });
                  }}
                />
              </React.Fragment>
            ))}
          </ScrollView>

          {values[Field.START] && values[Field.END] && (
            <ARButton
              label="Calculer mon itinéraire"
              size={ARButtonSize.Medium}
              styleContainer={styles.calculateButton}
              onPress={() => {}}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
