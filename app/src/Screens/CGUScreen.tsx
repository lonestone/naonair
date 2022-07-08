import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { setCGUAccepted } from '../actions/launch';
import { ARButton, ARButtonSize } from '../components/atoms/ARButton';
import { fonts, theme } from '../theme';
import { StackNavigationScreenProp } from '../types/routes';
import { API } from '../config.json';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1, padding: 15 },
  label: {
    ...fonts.Lato.regular,
    fontSize: 15,
    color: theme.colors.blue[500],
    flex: 1,
    marginLeft: 20,
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
      <View
        style={{ flexDirection: 'row', paddingTop: 20, paddingHorizontal: 10 }}>
        <Switch
          trackColor={{ false: '#B2B2C1', true: '#4863F1' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#B2B2C1"
          onValueChange={setIsChecked}
          value={isChecked}
        />
        <TouchableWithoutFeedback
          onPress={() => setIsChecked(!isChecked)}
          style={styles.container}>
          <Text style={styles.label}>
            En cochant cette case, je reconnais avoir pris connaissance des
            éléments constituant les{' '}
            <Text
              style={StyleSheet.flatten([
                styles.label,
                { color: 'blue', textDecorationLine: 'underline' },
              ])}
              onPress={() => Linking.openURL(`${API.baseUrl}CGU_Naonair.pdf`)}>
              Conditions Générales d'Utilisation
            </Text>{' '}
            de l'application mobile Naonair.
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <ARButton
        label="C'est parti !"
        onPress={handleAcceptedCGU}
        size={ARButtonSize.Medium}
        styleContainer={styles.button}
        disabled={!isChecked}
      />
    </SafeAreaView>
  );
};

export default CGUScreen;
