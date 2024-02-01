import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts, theme } from '../../theme';
import ARSwitch from '../atoms/ARSwitch';

interface ARNotificationRowProps {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  loading: boolean;
  authorizedPermissions: boolean;
  isTitle?: boolean;
  showSelectAll?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    ...fonts.Lato.regular,
  },
  title: {
    fontSize: 18,
    ...fonts.Lato.bold,
  },
  titleContainer: {
    borderColor: theme.colors.accent,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 16,
  },
  selectAllContainer: { flex: 1, alignItems: 'flex-end' },
  selectAllText: {
    ...fonts.Lato.regular,
    fontSize: 14,
    lineHeight: 16,
    marginRight: 12,
    alignSelf: 'flex-end',
  },
});

const ARNotificationRow = ({
  name,
  value,
  onChange,
  loading,
  authorizedPermissions,
  isTitle = false,
  showSelectAll = false,
}: ARNotificationRowProps) => {
  return (
    <View style={[styles.container, isTitle && styles.titleContainer]}>
      <Text style={[!isTitle ? styles.text : styles.title]}>{name}</Text>
      {showSelectAll && (
        <View style={styles.selectAllContainer}>
          <Text style={styles.selectAllText}>Tout sélectionner</Text>
        </View>
      )}
      <ARSwitch
        onChange={onChange}
        value={value}
        loading={loading}
        disabled={!authorizedPermissions}
      />
    </View>
  );
};

export default ARNotificationRow;
