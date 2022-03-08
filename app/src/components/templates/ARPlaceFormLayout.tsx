import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Position } from 'geojson';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Portal, Provider } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import {
  removePlaceStorage,
  setPlaceStorage,
  updatePlaceStorage,
} from '../../actions/myplaces';
import { MapboxFeature, POICategory, poiIcons } from '../../actions/poi';
import useSnackbar from '../../contexts/snackbar.context';
import { theme } from '../../theme';
import { StackNavigationScreenProp, StackParamList } from '../../types/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARCommonHeader from '../molecules/ARCommonHeader';
import ARListItem from '../molecules/ARListItem';
import ARPlaceForm from '../organisms/ARPlaceForm';
import ARConfirmModal from './ARConfirmModal';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  button: {
    margin: 40,
    flex: 0,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});

type ARPlaceFormType = RouteProp<StackParamList, 'PlaceForm'>;

const ARPlaceFormLayout = () => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const { params } = useRoute<ARPlaceFormType>();

  const { setSnackbarStatus } = useSnackbar();

  const [name, setName] = useState('');
  const [results, setResults] = useState<MapboxFeature[]>([]);
  const [values, setValues] = useState<
    { coord: Position; text: string } | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!params) return;
    setName(params.poi.name);
    setValues({ coord: params.poi.geolocation, text: params.poi.adress });
  }, []);

  const handleOnsubmit = async () => {
    if (values) {
      setIsLoading(true);

      await setPlaceStorage({
        id: Date.now(),
        adress: values?.text,
        category: POICategory.FAVORITE,
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

  const handleOnUpdatesubmit = async () => {
    if (params && values) {
      setIsLoading(true);

      await updatePlaceStorage(params.poi.id, {
        id: params.poi.id,
        adress: values.text,
        category: POICategory.FAVORITE,
        name,
        geolocation: values.coord,
      });

      navigation.goBack();

      setSnackbarStatus?.({
        isVisible: true,
        label: "L'adresse a bien été modifiée",
        icon: 'check-circle',
        backgroundColor: theme.colors.quality.main.green,
      });
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    await removePlaceStorage(id);

    navigation.goBack();

    setSnackbarStatus?.({
      isVisible: true,
      label: "L'adresse a bien été suprimée",
      icon: 'check-circle',
      backgroundColor: theme.colors.quality.main.green,
    });
  };

  const isDisabled = useMemo(() => {
    if (!values || values?.coord.length === 0 || !name.length) {
      return true;
    }
  }, [name, values]);

  return (
    <Provider>
      <ARCommonHeader
        headline={
          params && params.poi ? "Modifier l'adresse" : 'Créer une adresse'
        }
        back
        deleteIcon={!!params}
        onDelete={() => setOpenModal(true)}
        onBack={navigation.goBack}
      />
      <View style={styles.container}>
        <ARPlaceForm
          name={name}
          setName={setName}
          values={values}
          setValues={setValues}
          setResults={setResults}
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
                    xml={poiIcons[`${POICategory.FAVORITE}`] || null}
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
        {params ? (
          <ARButton
            label="Modifier"
            size={ARButtonSize.Medium}
            styleContainer={styles.button}
            onPress={handleOnUpdatesubmit}
            disabled={isDisabled}
            loading={isLoading}
          />
        ) : (
          <ARButton
            label="Enregistrer"
            size={ARButtonSize.Medium}
            styleContainer={styles.button}
            onPress={handleOnsubmit}
            disabled={isDisabled}
            loading={isLoading}
          />
        )}
      </View>
      <Portal>
        <ARConfirmModal
          open={openModal}
          setOpen={setOpenModal}
          headline="Souhaitez-vous vraiment supprimer cette adresse ?"
          caption="Cet action est irreversible"
          onPress={() => params && handleRemove(params.poi.id as string)}
        />
      </Portal>
    </Provider>
  );
};

export default ARPlaceFormLayout;
