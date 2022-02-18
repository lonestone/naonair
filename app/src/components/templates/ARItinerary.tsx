import React from 'react';
import {Keyboard, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ARHeader from '../atoms/ARHeader';
import ARFilter, {ARFilterItem} from '../molecules/ARFilter';
import ARGeocoding from '../molecules/ARGeocoding';
import {theme} from '../../theme';

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

export default () => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        containerStyle={styles.container}>
        <View>
          <ARHeader>
            <SafeAreaView edges={['left', 'right', 'top']}>
              <View style={styles.row}>
                <View style={styles.icons}></View>
                <View style={styles.inputs}>
                  <ARGeocoding label="Depuis" />
                  <ARGeocoding label="Vers" />
                </View>
              </View>
              <ARFilter items={filterItems} onChange={() => {}} />
            </SafeAreaView>
          </ARHeader>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
