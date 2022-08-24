import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationScreenProp } from '../../types/routes';

export type BackButtonProps = Omit<
  ComponentProps<typeof IconButton>,
  'onPress' | 'icon' | 'style'
>;

const styles = StyleSheet.create({
  backButton: {
    padding: 0,
    margin: 0,
    marginTop: 3,
    marginRight: 10,
    flex: 0,
  },
});

const BackButton = (props: BackButtonProps) => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  if (!navigation.canGoBack()) {
    return null;
  }
  return (
    <IconButton
      onPress={() => navigation.goBack()}
      icon={() => <Icon name="arrow-back" size={32} color="black" />}
      style={styles.backButton}
      {...props}
    />
  );
};

export default BackButton;
