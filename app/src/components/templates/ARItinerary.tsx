import {Feature, Point, Position} from 'geojson';
import React, {useState} from 'react';
import {Keyboard, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {Divider, List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../theme';
import ARHeader from '../atoms/ARHeader';
import ARFilter, {ARFilterItem} from '../molecules/ARFilter';
import ARGeocoding from '../molecules/ARGeocoding';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 0,
  },
  inputs: {
    flex: 1,
  },
  icons: {},
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

export default () => {
  const [results, setResults] = useState<Feature[]>([]);
  const [value, setValue] = useState<Position>([-1.525139, 47.22919]);

  const [selectedField, setSelectedField] = useState<Field | undefined>();

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
              <View style={styles.row}>
                <View style={styles.icons}></View>
                <View style={styles.inputs}>
                  <ARGeocoding
                    label="Depuis"
                    onResults={setResults}
                    value={value}
                    onFocus={() => setSelectedField(Field.START)}
                  />
                  <ARGeocoding label="Vers" onResults={setResults} />
                </View>
              </View>
              <ARFilter items={filterItems} onChange={() => {}} />
            </>
          </ARHeader>

          <ScrollView style={styles.container} indicatorStyle="black">
            {(results || []).map(({properties, geometry}) => (
              <React.Fragment key={properties?.id}>
                <List.Item
                  title={properties?.label}
                  onPress={() => {
                    setValue((geometry as Point).coordinates);
                  }}
                />
                <Divider />
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
