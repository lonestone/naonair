import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Position } from 'geojson';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import {
  removePlaceStorage,
  setPlaceStorage,
  updatePlaceStorage,
} from '../../actions/myplaces';
import { POI, POICategory, poiIcons } from '../../actions/poi';
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

  const [name, setName] = useState<string>();
  const [results, setResults] = useState<POI[]>([]);
  const [values, setValues] = useState<
    { coord: Position; text: string } | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!params) return;

    const { poi } = params;
    setName(poi.name);
    setValues({ coord: poi.geolocation, text: poi.address });
  }, [params]);

  const handleOnsubmit = async () => {
    if (values && name) {
      setIsLoading(true);

      await setPlaceStorage({
        id: Date.now(),
        address: values?.text,
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
    if (params && values && name) {
      setIsLoading(true);

      await updatePlaceStorage(params.poi.id, {
        id: params.poi.id,
        address: values.text,
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

  const isVisible = useMemo(() => {
    if (name && name.length > 0 && values) {
      return true;
    } else return false;
  }, [name, values]);

  return (
    <>
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
          onTextChanged={() => {}}
        />
        <ScrollView
          style={styles.container}
          contentInset={{ bottom: 70, top: 0 }}
          indicatorStyle="black">
          {(results || []).map(({ geolocation, name, address }, index) => (
            <React.Fragment key={index}>
              <ARListItem
                key={`item-${index}`}
                title={name}
                description={address}
                leftIcon={() => (
                  <SvgXml
                    width="20"
                    height="20"
                    xml={poiIcons[POICategory.FAVORITE] || null}
                  />
                )}
                onPress={() => {
                  setValues({
                    coord: geolocation,
                    text: address.includes(name) ? address : name,
                  });
                  setResults([]);
                }}
              />
            </React.Fragment>
          ))}
        </ScrollView>
        {params ? (
          <>
            {isVisible && (
              <ARButton
                label="Modifier"
                size={ARButtonSize.Medium}
                styleContainer={styles.button}
                onPress={handleOnUpdatesubmit}
                loading={isLoading}
              />
            )}
          </>
        ) : (
          <>
            {isVisible && (
              <ARButton
                label="Enregistrer"
                size={ARButtonSize.Medium}
                styleContainer={styles.button}
                onPress={handleOnsubmit}
                loading={isLoading}
              />
            )}
          </>
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
    </>
  );
};

export default ARPlaceFormLayout;
