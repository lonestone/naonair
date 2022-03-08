import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Headline, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fonts, theme } from '../../theme';
import ARHeader from '../atoms/ARHeader';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    padding: 0,
    margin: 0,
  },
  backButton: {
    padding: 0,
    margin: 0,
    marginTop: 3,
    marginRight: 10,
    flex: 0,
  },
  deleteButton: { marginLeft: 'auto', padding: 0, margin: 0 },
  headlineContainer: {
    flexDirection: 'row',
  },
  headline: {
    flex: 0,
    alignItems: 'stretch',
    color: theme.colors.blue[500],
    fontSize: 20,
    textAlignVertical: 'top',
    ...fonts.Raleway.bold,
  },
  caption: {
    color: theme.colors.blue[300],
    fontSize: 14,
    lineHeight: 20,
  },
});

interface Props {
  headline: string;
  caption?: string;
  back?: boolean;
  deleteIcon?: boolean;
  onDelete?: () => void;
  onBack?: () => void;
}

const ARCommonHeader = ({
  caption,
  headline,
  back,
  deleteIcon,
  onDelete,
  onBack,
}: Props) => {
  return (
    <ARHeader>
      <View style={styles.container}>
        {!!back && (
          <IconButton
            onPress={onBack}
            icon={() => <Icon name="arrow-back" size={32} color="black" />}
            style={styles.backButton}
          />
        )}
        <View>
          <Headline style={styles.headline}>{headline}</Headline>

          {!!caption && <Caption style={styles.caption}>{caption}</Caption>}
        </View>
        {!!deleteIcon && (
          <IconButton
            onPress={onDelete}
            icon={() => <Icon name="delete" size={24} color="red" />}
            style={styles.deleteButton}
          />
        )}
      </View>
    </ARHeader>
  );
};

export default ARCommonHeader;
