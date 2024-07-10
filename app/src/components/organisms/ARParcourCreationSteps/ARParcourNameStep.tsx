import React, { useState } from 'react';

import { StyleSheet, View, ViewProps } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { theme } from '@theme';
import { ARButton } from '../../atoms/ARButton';

type ARParcourNameStepProps = {
  onValidate: (name: string) => void;
} & ViewProps;

const style = StyleSheet.create({
  container: {
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.blue[500],
  },
  input: {
    marginTop: 20,
    backgroundColor: theme.colors.white,
  },
  btn: {
    marginTop: 20,
  },
});

export default ({ onValidate, ...props }: ARParcourNameStepProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const validateName = () => {
    if (name === '') {
      setError('Le nom du parcours est obligatoire');
      return;
    }

    setError('');
    onValidate(name);
  };

  return (
    <View {...props} style={StyleSheet.flatten([style.container, props.style])}>
      <Text style={style.title}>Enregister votre parcours</Text>
      <TextInput
        autoFocus
        style={style.input}
        label="Nom du parcours"
        value={name}
        mode="outlined"
        onChangeText={setName}
      />
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
      <ARButton
        styleContainer={style.btn}
        onPress={() => validateName()}
        label="Valider"
      />
    </View>
  );
};
