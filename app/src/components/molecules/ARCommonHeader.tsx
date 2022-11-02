import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Headline } from 'react-native-paper';
import { fonts, theme } from '../../theme';
import ARHeader from '../atoms/ARHeader';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    padding: 0,
    margin: 0,
  },
  headlineContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  headline: {
    fontSize: 20,
    color: theme.colors.blue[500],
    textAlignVertical: 'top',
    ...fonts.Raleway.bold,
  },
  caption: {
    fontSize: 14,
    color: theme.colors.blue[300],
    ...fonts.Lato.regular,
    lineHeight: 20,
  },
});

interface Props {
  headline: string;
  caption?: string;
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}

const ARCommonHeader = ({
  caption,
  headline,
  left,
  right,
  children,
}: Props) => {
  return (
    <ARHeader>
      <>
        <View style={styles.container}>
          {left}
          <View style={styles.headlineContainer}>
            <Headline numberOfLines={2} style={styles.headline}>
              {headline}
            </Headline>
            {!!caption && <Caption style={styles.caption}>{caption}</Caption>}
          </View>
          {right}
        </View>
        {children}
      </>
    </ARHeader>
  );
};

export default ARCommonHeader;
