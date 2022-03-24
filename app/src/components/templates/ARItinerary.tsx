import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Position } from 'geojson';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { POI } from '../../actions/poi';
import { RouteProfile } from '../../actions/routes';
import { theme } from '../../theme';
import { StackNavigationScreenProp, TabParamList } from '../../types/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARHeader from '../atoms/ARHeader';
import ARAddressInput from '../molecules/ARAddressInput';
import ARFilter, { ARFilterItem } from '../molecules/ARFilter';
import ARListItem from '../molecules/ARListItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    value: RouteProfile.Bike,
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
    value: RouteProfile.ElecBike,
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
    value: RouteProfile.Walk,
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

type ARItineraryRouteProps = RouteProp<TabParamList, 'Itinéraires'>;

export default () => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const { params } = useRoute<ARItineraryRouteProps>();
  const [results, setResults] = useState<POI[]>([]);
  const [transportMode, setTransportMode] = useState<RouteProfile[]>([
    RouteProfile.Bike,
  ]);

  const { left, right } = useSafeAreaInsets();

  const [values, setValues] = useState<{
    [key: string]: { coord: Position; text: string } | undefined;
  }>({
    [Field.START]: params?.start ?? undefined,
    [Field.END]: params?.end ?? undefined,
  });

  useEffect(() => {
    setValues({
      [Field.START]: params?.start ?? undefined,
      [Field.END]: params?.end ?? undefined,
    });
  }, [params]);

  const [selectedField, setSelectedField] = useState<Field>(Field.START);

  const onClear = useCallback(() => {
    setValues({ ...values, [selectedField]: undefined });
  }, [values, selectedField]);

  const onUserLocation = useCallback(
    (coord: Position, text: string) => {
      setValues({ ...values, [selectedField]: { coord, text } });
    },
    [values, selectedField],
  );

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
          onUserLocation={(coord, text) => {
            setSelectedField(field);
            onUserLocation(coord, text);
          }}
          onClear={() => {
            setSelectedField(field);
            onClear();
          }}
          onTextChanged={() => {
            setValues({
              ...values,
              [field]: undefined,
            });
          }}
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
              <ARFilter
                items={filterItems}
                style={{
                  marginLeft: -18 - left,
                  marginRight: -18 - right,
                  paddingLeft: 18 + left,
                }}
                contentInset={{ right: 18 + right }}
                onChange={items => {
                  setTransportMode(items.map(i => i.value));
                }}
              />
            </>
          </ARHeader>

          <ScrollView
            style={styles.container}
            contentContainerStyle={{
              paddingBottom: values[Field.START] && values[Field.END] ? 120 : 0,
            }}
            keyboardShouldPersistTaps="always"
            onScrollBeginDrag={Keyboard.dismiss}
            accessibilityLabel="Resultats de la recheche"
            indicatorStyle="black">
            {(results || []).map(
              ({ id, address, geolocation, name, category }) => (
                <ARListItem
                  key={id}
                  category={category}
                  title={name}
                  description={address}
                  onPress={() => {
                    setValues({
                      ...values,
                      [selectedField.toString()]: {
                        coord: geolocation,
                        text: name,
                      },
                    });
                  }}
                />
              ),
            )}
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
              transportMode: transportMode[0],
            });
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};
