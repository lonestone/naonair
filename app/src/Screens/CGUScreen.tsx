import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Paragraph, Subheading, Title } from 'react-native-paper';
import { setCGUAccepted } from '../actions/launch';
import { ARButton, ARButtonSize } from '../components/atoms/ARButton';
import { fonts, theme } from '../theme';

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
    ],
  },
];

const CGUScreen = () => {
  const handleAcceptedCGU = async () => {
    await setCGUAccepted('true');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {cguArticle.map(article => (
          <>
            <Title style={styles.title}>{article.title}</Title>
            {article.paragraph.map(p => (
              <>
                <Subheading style={styles.subheading}>
                  {p.subheading}
                </Subheading>
                <Paragraph style={styles.description}>
                  {p.description}
                </Paragraph>
              </>
            ))}
          </>
        ))}
      </ScrollView>
      <ARButton
        label="J'accepte les CGU"
        onPress={handleAcceptedCGU}
        size={ARButtonSize.Small}
        styleContainer={styles.button}
      />
    </SafeAreaView>
  );
};

export default CGUScreen;
