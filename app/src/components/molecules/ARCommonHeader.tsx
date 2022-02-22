import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Headline } from 'react-native-paper';
import { theme } from '../../theme';
import ARHeader from '../atoms/ARHeader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headlineContainer: {
    flexDirection: 'row',
  },
  headline: {
    flex: 1,
    alignItems: 'stretch',
    color: theme.colors.blue[500],
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 24,
  },
  caption: {
    color: theme.colors.blue[300],
    fontSize: 14,
    lineHeight: 20,
  },
});

interface Props {
  headline: string;
  caption: string;
}

const ARCommonHeader = ({ caption, headline }: Props) => {
  return (
    <ARHeader>
      <>
        <View style={styles.headlineContainer}>
          <Headline style={styles.headline}>{headline}</Headline>
        </View>
        <Caption style={styles.caption}>{caption}</Caption>
      </>
    </ARHeader>
  );
};

export default ARCommonHeader;
