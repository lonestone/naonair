import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  NativeScrollEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Paragraph, Subheading, Title } from 'react-native-paper';
import { setCGUAccepted } from '../actions/launch';
import { ARButton, ARButtonSize } from '../components/atoms/ARButton';
import { fonts, theme } from '../theme';
import { StackNavigationScreenProp } from '../types/routes';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1, padding: 12 },
  title: { ...fonts.Raleway.bold, fontSize: 20, color: theme.colors.blue[500] },
  subheading: {
    ...fonts.Raleway.bold,
    fontSize: 16,
    color: theme.colors.blue[500],
    marginTop: 12,
  },
  description: {
    ...fonts.Lato.regular,
    fontSize: 14,
    color: theme.colors.blue[500],
  },
  button: {
    margin: 40,
    flex: 0,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});

const cguArticle = [
  {
    id: 1,
    title: 'Chapitre 1',
    paragraph: [
      {
        subheading: '1.1 Titre 1',
        description:
          'Lobortis sem convallis placerat adipiscing diam eget maecenas. Scelerisque sit lorem sodales velit at nulla. Suspendisse elementum enim nunc accumsan. Semper arcu euismod quisque praesent. Nisi volutpat vitae nullam egestas arcu facilisi. Mattis felis feugiat mauris nibh dui vivamus. Venenatis ut pulvinar nisl sit tortor et a massa in. Pharetra ut leo morbi iaculis tortor mauris. Lobortis vulputate mauris, tristique vitae, potenti pellentesque dignissim.',
      },
      {
        subheading: '1.2 Titre 2',
        description:
          ' Scelerisque sit lorem sodales velit at nulla. Suspendisse elementum enim nunc accumsan. Semper arcu euismod quisque praesent. ',
      },
      {
        subheading: '1.1 Titre 1',
        description:
          'Lobortis sem convallis placerat adipiscing diam eget maecenas. Scelerisque sit lorem sodales velit at nulla. Suspendisse elementum enim nunc accumsan. Semper arcu euismod quisque praesent. Nisi volutpat vitae nullam egestas arcu facilisi. Mattis felis feugiat mauris nibh dui vivamus. Venenatis ut pulvinar nisl sit tortor et a massa in. Pharetra ut leo morbi iaculis tortor mauris. Lobortis vulputate mauris, tristique vitae, potenti pellentesque dignissim.',
      },
      {
        subheading: '1.1 Titre 1',
        description:
          'Lobortis sem convallis placerat adipiscing diam eget maecenas. Scelerisque sit lorem sodales velit at nulla. Suspendisse elementum enim nunc accumsan. Semper arcu euismod quisque praesent. Nisi volutpat vitae nullam egestas arcu facilisi. Mattis felis feugiat mauris nibh dui vivamus. Venenatis ut pulvinar nisl sit tortor et a massa in. Pharetra ut leo morbi iaculis tortor mauris. Lobortis vulputate mauris, tristique vitae, potenti pellentesque dignissim.',
      },
      {
        subheading: '1.1 Titre 1',
        description:
          'Lobortis sem convallis placerat adipiscing diam eget maecenas. Scelerisque sit lorem sodales velit at nulla. Suspendisse elementum enim nunc accumsan. Semper arcu euismod quisque praesent. Nisi volutpat vitae nullam egestas arcu facilisi. Mattis felis feugiat mauris nibh dui vivamus. Venenatis ut pulvinar nisl sit tortor et a massa in. Pharetra ut leo morbi iaculis tortor mauris. Lobortis vulputate mauris, tristique vitae, potenti pellentesque dignissim.',
      },
    ],
  },
];

const CGUScreen = () => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const [isDisabled, setIsDisabled] = useState(true)

  const handleAcceptedCGU = async () => {
    await setCGUAccepted('1.0');
    navigation.navigate('Home');
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 10;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setIsDisabled(false);
          }
        }}
        scrollEventThrottle={1400}>
        {cguArticle.map((article, idx) => (
          <View key={`article-${idx}`} style={{marginBottom: 100}}>
            <Title style={styles.title}>{article.title}</Title>
            {article.paragraph.map((p, id) => (
              <View key={`paragraph-${id}`}>
                <Subheading style={styles.subheading}>
                  {p.subheading}
                </Subheading>
                <Paragraph style={styles.description}>
                  {p.description}
                </Paragraph>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <ARButton
        label="J'accepte les CGU"
        onPress={handleAcceptedCGU}
        size={ARButtonSize.Small}
        styleContainer={styles.button}
        disabled={isDisabled}
      />
    </SafeAreaView>
  );
};

export default CGUScreen;
