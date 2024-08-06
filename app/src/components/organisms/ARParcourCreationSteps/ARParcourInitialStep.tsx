import React, { useCallback } from 'react';

import { StyleSheet, View, ViewProps } from 'react-native';
import { Text } from 'react-native-paper';
import { ARButton, ARButtonSize } from '../../atoms/ARButton';
import { theme } from '@theme';
import Icon from 'react-native-vector-icons/FontAwesome5';

type ARParcoursInitialStepsProps = {
  onStart: () => void;
} & ViewProps;

const style = StyleSheet.create({
  container: {
    height: '100%',
  },
  description: {
    marginTop: 12,
    color: theme.colors.blue[300],
    fontSize: 18,
    lineHeight: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  action: {
    marginTop: 38,
  },
  btnLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

const desc =
  'Pour enregistrer votre parcours personnalisé, vous devez cliquer sur “Démarrer l’enregistrement”, réaliser votre parcours à garder en mémoire et enfin cliquer sur “Arrêter l’enregistrement” pour pouvoir le refaire plus tard.';

export default ({ onStart, ...props }: ARParcoursInitialStepsProps) => {
  const icon = useCallback(
    () => <Icon name="location-arrow" size={18} color="white" />,
    [],
  );

  return (
    <View {...props} style={StyleSheet.flatten([style.container, props.style])}>
      <Text style={style.title}>Créer votre parcours</Text>
      <Text style={style.description}>{desc}</Text>
      <View style={style.action}>
        <ARButton
          onPress={onStart}
          label="Démarrer l'enregistrement"
          icon={icon}
          labelStyle={style.btnLabel}
          size={ARButtonSize.Medium}
        />
      </View>
    </View>
  );
};
