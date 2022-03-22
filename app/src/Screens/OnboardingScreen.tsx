import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, ImageProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setIsFirstLaunched } from '../actions/launch';
import Footer from '../components/atoms/ARSlideFooter';
import Slide from '../components/organisms/ARSLide';
import { theme } from '../theme';
import { StackNavigationScreenProp } from '../types/routes';

const dimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
});

export type Item = {
  id: number;
  img: ImageProps;
  title: string;
  caption: string;
  description: string;
};

const slidesItem: Item[] = [
  {
    id: 1,
    img: require('../assets/onboarding/step1.png'),
    title: 'Gardez un oeil sur la qualité de l’air autour de vous',
    caption: "S'informer en temps réel",
    description:
      'Grâce à Naonair, retrouvez les niveaux de pollution sur la métropole Nantaise en temps réel et dans les prochaines heures.',
  },
  {
    id: 2,
    img: require('../assets/onboarding/step2.png'),
    title: 'Organisez vos trajets du quotidien',
    caption: 'Limiter votre exposition à la pollution',
    description:
      "Cette fonctionnalité vous permettra de prendre en compte la qualité de l'air dans vos choix d'itinéraires",
  },
  {
    id: 3,
    img: require('../assets/onboarding/step3.png'),
    title: 'Découvrez des parcours sportifs et des promenades',
    caption: 'Respirer un air meilleur',
    description:
      "Avec Naonair, organisez vos activités et sorties sportives en fonction de la qualité de l'air : respirez, bougez !",
  },
];

interface Props {
  CGUAccepted?: string;
}

const OnboardingScren = ({ CGUAccepted }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const ref = useRef<FlatList<Item>>(null);

  const navigation = useNavigation<StackNavigationScreenProp>();

  const updateCurrentSlideIndex = (e: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / dimensions.width);
    setCurrentIndex(currentIndex);
  };

  const handleNextSlide = async () => {
    const newtSlideIndex = currentIndex + 1;
    if (newtSlideIndex != slidesItem.length) {
      ref.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(newtSlideIndex);
    } else if (newtSlideIndex === slidesItem.length) {
      console.log('here', CGUAccepted === null);

      if (CGUAccepted === null) {
        await setIsFirstLaunched('false');
        navigation.navigate('CGU');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{ height: dimensions.height * 0.95 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slidesItem}
        pagingEnabled
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer
        slides={slidesItem}
        currentIndex={currentIndex}
        handleNextSlide={handleNextSlide}
      />
    </SafeAreaView>
  );
};

export default OnboardingScren;
