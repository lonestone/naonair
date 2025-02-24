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
import Geolocation from '@react-native-community/geolocation';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getAllHistoryPlaces,
  setHistoryPlaceStorage,
} from '../../actions/myhistory';
import { POI, POICategory, reverse } from '../../actions/poi';
import { RouteProfile } from '../../actions/routes';
import { fonts, theme } from '@theme';
import { StackNavigationScreenProp, TabParamList } from '@type/routes';
import logger from '@utils/logger';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARHeader from '../atoms/ARHeader';
import ARAddressInput from '@molecules/ARAddressInput';
import ARFilter, { ARFilterItem } from '@molecules/ARFilter';
import ARListItem from '@molecules/ARListItem';
import analytics from '@react-native-firebase/analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
  historyContent: {
    paddingBottom: 18,
  },
  history: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    color: theme.colors.blue[500],
    fontSize: 16,
    ...fonts.Lato.regular,
  },
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

const filterItems: ARFilterItem<RouteProfile>[] = [
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

export enum Field {
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
  const [selectedResult, setSelectedResult] = useState<POI>();

  const getUserPosition = useCallback(() => {
    Geolocation.getCurrentPosition(
      async ({ coords: { longitude, latitude } }) => {
        const coord = [longitude, latitude];
        const features = await reverse(coord);
        if (!values[Field.START]) {
          setValues({
            ...values,
            [Field.START]: { coord, text: features[0].text_fr },
          });
        }
      },
    );
  }, [values]);

  useEffect(() => {
    navigation.addListener('focus', getUserPosition);
    return () => navigation.removeListener('focus', getUserPosition);
  });

  useEffect(() => {
    console.info(params);
    setValues({
      [Field.START]: params?.start ?? undefined,
      [Field.END]: params?.end ?? undefined,
    });
  }, [params]);

  const [selectedField, setSelectedField] = useState<Field>(Field.START);

  const onClear = useCallback(
    (field: Field) => {
      setValues({ ...values, [field]: undefined });
    },
    [values],
  );

  const onUserLocation = useCallback(
    (coord: Position, text: string, field: Field) => {
      setValues({ ...values, [field]: { coord, text } });
    },
    [values],
  );

  const [historyList, setHistoryList] = useState<POI[]>();

  const readItemFromStorage = async () => {
    const history = await getAllHistoryPlaces();
    if (history) {
      try {
        setHistoryList(Array.isArray(history) ? history : [history]);
      } catch (e) {
        logger.error(e, 'fromGetAllHistoryPlaces');
      }
    }
  };

  useEffect(() => {
    navigation.addListener('focus', readItemFromStorage);
    return () => navigation.removeListener('focus', readItemFromStorage);
  }, [navigation]);

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
            onUserLocation(coord, text, field);
          }}
          onClear={() => {
            onClear(field);
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

  const handleOnPress = async (
    start: Position | undefined,
    end: Position | undefined,
    mode: RouteProfile,
  ) => {
    await analytics().logEvent('calculer_itineraire_button');
    navigation.navigate('ChooseItinerary', {
      start,
      end,
      transportMode: mode,
    });

    setHistoryPlaceStorage(selectedResult!);
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
              <ARFilter<RouteProfile>
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
            {(results || []).map(result => (
              <ARListItem
                key={result.id}
                category={result.category}
                title={result.name}
                description={result.address}
                onPress={() => {
                  setSelectedResult({
                    ...result,
                    category: POICategory.HISTORY,
                  });
                  setValues({
                    ...values,
                    [selectedField.toString()]: {
                      coord: result.geolocation,
                      text: result.name,
                    },
                  });
                  Keyboard.dismiss();
                }}
              />
            ))}
            {historyList && historyList.length > 0 && (
              <View style={styles.historyContent}>
                <Text style={styles.history}>Recherches récentes</Text>
                {historyList.map(
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
                        Keyboard.dismiss();
                      }}
                    />
                  ),
                )}
              </View>
            )}
          </ScrollView>
          {values[Field.START] && values[Field.END] && (
            <ARButton
              label="Calculer mon itinéraire"
              size={ARButtonSize.Medium}
              styleContainer={styles.calculateButton}
              onPress={() =>
                handleOnPress(
                  values[Field.START]?.coord,
                  values[Field.END]?.coord,
                  transportMode[0],
                )
              }
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
