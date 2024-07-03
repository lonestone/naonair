import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationScreenProp } from '@type/routes';

export type DeleteButtonProps = Omit<
  ComponentProps<typeof IconButton>,
  'icon' | 'style'
>;

const styles = StyleSheet.create({
  deleteButton: { marginLeft: 'auto', padding: 0, margin: 0 },
});

const DeleteButton = (props: DeleteButtonProps) => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  if (!navigation.canGoBack()) {
    return null;
  }
  return (
    <IconButton
      icon={() => <Icon name="delete" size={24} color="red" />}
      style={styles.deleteButton}
      {...props}
    />
  );
};

export default DeleteButton;
