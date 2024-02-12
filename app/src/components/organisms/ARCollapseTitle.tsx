import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';
import { fonts, theme } from '../../theme';

export interface ARCollapseTitleProp {
  title: string;
}

const ARCollapseTitle = ({
  title,
  children,
}: PropsWithChildren<ARCollapseTitleProp>) => {
  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  return (
    <View style={styles.container}>
      <List.Accordion
        title={title}
        expanded={expanded}
        onPress={handlePress}
        titleStyle={styles.title}
        rippleColor={'transparent'}>
        {children}
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {},
  title: {
    ...fonts.Raleway.bold,
    fontSize: 20,
    color: theme.colors.black,
    lineHeight: 24,
  },
});

export default ARCollapseTitle;
