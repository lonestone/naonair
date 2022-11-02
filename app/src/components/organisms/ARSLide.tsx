import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Item } from '../../screens/OnboardingScreen';
import { fonts, theme } from '../../theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  image: {
    width,
    marginVertical: 10,
  },
  content: { marginLeft: 20, width: 350 },
  caption: {
    ...fonts.Raleway.bold,
    fontSize: 14,
    marginVertical: 5,
    color: theme.colors.white,
    opacity: 0.6,
  },
  title: {
    ...fonts.Raleway.bold,
    fontSize: 26,
    marginVertical: 5,
    color: theme.colors.white,
  },
  description: {
    ...fonts.Lato.regular,
    fontSize: 16,
    marginVertical: 5,
    color: theme.colors.white,
  },
});

interface Props {
  item: Item;
}

const Slide = ({ item }: Props) => {
  return (
    <View>
      <Image source={item.img} style={styles.image} resizeMode="contain" />
      <View style={styles.content}>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default Slide;
