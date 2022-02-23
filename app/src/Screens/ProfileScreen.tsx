import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import ARCommonHeader from '../components/molecules/ARCommonHeader';
import ARListItem from '../components/molecules/ARListItem';
import { theme } from '../theme';
import { ProfileItemType } from '../types/profile';
import { NavigationScreenProp, StackParamList } from '../types/routes';

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
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.accent,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const profileItems: ProfileItemType[] = [
  { icon: 'star', title: 'Mes favoris', link: 'Favorites' },
  { icon: 'book-open-blank-variant', title: 'CGU' },
  { icon: 'clipboard-check', title: 'Mentions légales' },
  {
    icon: 'information',
    linkIcon: 'launch',
    title: 'En savoir plus sur Naonair',
    url: 'https://www.airpl.org',
  },
  {
    icon: 'information',
    linkIcon: 'launch',
    title: 'En savoir plus sur AirPDL',
    url: 'https://www.airpl.org',
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationScreenProp>();

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

  return (
    <>
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
      </SafeAreaView>
    </>
  );
};

export default ProfileScreen;
