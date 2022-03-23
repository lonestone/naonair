import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { setCGUAccepted } from '../actions/launch';
import { ARButton, ARButtonSize } from '../components/atoms/ARButton';
import { fonts, theme } from '../theme';
import { StackNavigationScreenProp } from '../types/routes';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1, padding: 15 },
  label: {
    ...fonts.Lato.regular,
    fontSize: 15,
    color: theme.colors.blue[500],
    marginHorizontal: 10,
  },
  button: {
    margin: 40,
    flex: 0,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});

const CGUScreen = () => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const [isChecked, setIsChecked] = useState(false);

  const handleAcceptedCGU = async () => {
    await setCGUAccepted('1.0');
    navigation.navigate('Home');
  };

  //* TODO add real CGU link and check version*

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', flexGrow: 3 }}>
        <Checkbox
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={() => {
            setIsChecked(!isChecked);
          }}
        />
        <Text style={styles.label}>
          En cochant cette case, je reconnais avoir pris connaissance des
          éléments constituant les{' '}
          <Text
            style={StyleSheet.flatten([styles.label, { color: 'blue', textDecorationLine: "underline" }])}
            onPress={() => Linking.openURL('https://policies.google.com/terms?hl=fr')}>
            Conditions Générales d'Utilisation
          </Text>{' '}
          de l'application mobile Naonair.
        </Text>
      </View>
      <ARButton
        label="C'est parti !"
        onPress={handleAcceptedCGU}
        size={ARButtonSize.Small}
        styleContainer={styles.button}
        disabled={!isChecked}
      />
    </SafeAreaView>
  );
};

export default CGUScreen;
