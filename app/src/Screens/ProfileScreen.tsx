import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { List, Portal, Provider } from 'react-native-paper';
import { clearStorage } from '../actions/myplaces';
import { ARButton, ARButtonSize } from '../components/atoms/ARButton';
import ARCommonHeader from '../components/molecules/ARCommonHeader';
import ARListItem from '../components/molecules/ARListItem';
import ARConfirmModal from '../components/templates/ARConfirmModal';
import { fonts, theme } from '../theme';
import { ProfileItemType } from '../types/profile';
import { StackNavigationScreenProp, StackParamList } from '../types/routes';
import { API } from '../config.json';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  markerContainer: {
    overflow: 'visible',
    width: 40,
    height: 46,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  item: {
    color: theme.colors.blue[500],
    fontSize: 16,
    ...fonts.Lato.regular,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.accent,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 40,
    position: 'absolute',
    bottom: 0,
    elevation: 0,
    alignSelf: 'center',
    backgroundColor: theme.colors.lightRed,
  },
  buttonLabel: {
    color: theme.colors.quality.main.red,
  },
});

const profileItems: ProfileItemType[] = [
  { icon: 'star', title: 'Mes favoris', link: 'Favorites' },
  {
    icon: 'book-open-blank-variant',
    title: 'CGU',
    url: `${API.baseUrl}files/CGU_Naonair.pdf`,
  },
  {
    icon: 'information',
    linkIcon: 'launch',
    title: 'En savoir plus sur Naonair',
    url: 'https://naonair.org',
  },
  {
    icon: 'information',
    linkIcon: 'launch',
    title: 'En savoir plus sur Air Pays de la Loire',
    url: 'https://www.airpl.org',
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const [openModal, setOpenModal] = useState(false);

  const handlePress = async (url?: any, link?: keyof StackParamList) => {
    // Checking if the link is supported for links with custom URL scheme.
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } else if (link) {
      return navigation.navigate('Favorites');
    }
  };

  const handleRemove = () => {
    clearStorage();
    setOpenModal(false);
  };

  return (
    <Provider>
      <ARCommonHeader
        headline="Mon Profil"
        caption="Retrouvez ici vos informations personnelles"
      />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {profileItems.map(({ title, icon, linkIcon, url, link }, index) => (
            <ARListItem
              key={index}
              title={title}
              titleStyle={styles.item}
              leftIcon={props => (
                <List.Icon
                  {...props}
                  style={styles.iconContainer}
                  color={theme.colors.blue[500]}
                  icon={icon}
                />
              )}
              rightIcon={linkIcon}
              onPress={() => handlePress(url, link)}
            />
          ))}
        </ScrollView>
        <ARButton
          label="Supprimer mes données"
          size={ARButtonSize.Medium}
          icon="delete"
          labelStyle={styles.buttonLabel}
          styleContainer={styles.button}
          onPress={() => setOpenModal(true)}
        />
        <Portal>
          <ARConfirmModal
            open={openModal}
            setOpen={setOpenModal}
            headline="Souhaitez-vous vraiment supprimer vos données ?"
            caption="Cet action est irreversible et supprimera vos adresses favorites
            ainsi que tout votre historique"
            onPress={handleRemove}
          />
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};

export default ProfileScreen;
