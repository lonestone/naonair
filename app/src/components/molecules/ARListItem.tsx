import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { Divider, List } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { theme } from '../../theme';

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
});

interface ARListItemProps {
  title: string;
  description?: string;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  leftIcon: Element | IconSource;
  rightIcon?: any;
  rightChip?: any;
  onPress?: () => void;
}

const ARListItem = ({
  title,
  description,
  titleStyle,
  descriptionStyle,
  leftIcon,
  rightIcon,
  rightChip,
  onPress,
}: ARListItemProps) => {
  return (
    <>
      <View>
        <List.Item
          title={title}
          titleStyle={titleStyle}
          description={description}
          onPress={onPress}
          descriptionStyle={descriptionStyle}
          left={props => (
            <List.Icon
              {...props}
              style={styles.iconContainer}
              icon={leftIcon}
              color={theme.colors.blue[500]}
            />
          )}
          right={() => (
            <>
              {rightIcon && (
                <List.Icon
                  icon={rightIcon}
                  color={theme.colors.blue[500]}
                />
              )}
              {rightChip && rightChip}
            </>
          )}
        />
      </View>
      <Divider />
    </>
  );
};

export default ARListItem;
