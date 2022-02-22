import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import ARCommonHeader from '../components/molecules/ARCommonHeader';
import ARListItem from '../components/molecules/ARListItem';
import { theme } from '../theme';

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
    fontWeight: '500',
  },
});

type ProfilItemType = {
  icon: IconSource;
  title: string;
  linkIcon?: IconSource;
  link?: string;
};

const profilItem: ProfilItemType[] = [
  { icon: 'star', title: 'Mes favoris' },
  { icon: 'book-open-blank-variant', title: 'CGU' },
  { icon: 'clipboard-check', title: 'Mentions légales' },
  {
    icon: 'information',
    linkIcon: 'launch',
    title: 'En savoir plus sur Naonair',
    link: 'url:naonair.fr',
  },
  {
    icon: 'information',
    linkIcon: 'launch',
    title: 'En savoir plus sur AirPDL',
    link: 'url:airpdl.fr',
  },
];

const ProfileScreen = () => {
  return (
    <>
      <ARCommonHeader
        headline="Mon Profil"
        caption="Retrouvez ici vos informations personnelles"
      />
      <SafeAreaView style={styles.container}>
        {profilItem.map((item, index) => (
          <ARListItem
            key={index}
            title={item.title}
            titleStyle={styles.item}
            leftIcon={item.icon}
            rightIcon={item.linkIcon}
            onPress={() => console.log(item.link)}
          />
        ))}
      </SafeAreaView>
    </>
  );
};

export default ProfileScreen;
