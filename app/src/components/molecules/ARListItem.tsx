import React, { useCallback } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Divider, List } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { SvgXml } from 'react-native-svg';
import { POICategory, poiIcons } from '../../actions/poi';
import { fonts, theme } from '../../theme';

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.accent,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...fonts.Lato.medium,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.blue[500],
  },
  description: {
    ...fonts.Lato.regular,
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.blue[300],
  },
});

interface ARListItemProps {
  title: string;
  description?: string;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  category?: POICategory;
  leftIcon?: IconSource;
  rightIcon?: any;
  rightChip?: any;
  onPress?: () => void;
}

const ARListItem = ({
  title,
  description,
  titleStyle,
  descriptionStyle,
  category,
  rightIcon,
  rightChip,
  leftIcon,
  onPress,
}: ARListItemProps) => {
  const getIcon = useCallback((): IconSource => {
    if (leftIcon) {
      return leftIcon;
    } else if (!category || !poiIcons[category!]) {
      return 'navigation';
    }

    return () => (
      <SvgXml
        width="20"
        height="20"
        xml={poiIcons[category!]!}
        fill="#25244E"
      />
    );
  }, [leftIcon, category]);

  return (
    <>
      <List.Item
        title={title}
        titleStyle={[styles.title, titleStyle]}
        description={description}
        onPress={onPress}
        descriptionStyle={[styles.description, descriptionStyle]}
        left={props => (
          <List.Icon
            {...props}
            style={styles.iconContainer}
            icon={getIcon()}
            color={theme.colors.blue[500]}
          />
        )}
        right={() => (
          <>
            {rightIcon && (
              <List.Icon icon={rightIcon} color={theme.colors.blue[500]} />
            )}
            {rightChip && rightChip}
          </>
        )}
      />

      <Divider />
    </>
  );
};

export default ARListItem;
