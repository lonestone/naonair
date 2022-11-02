import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import buttonIcon from '../../assets/wave-icon.svg';
import { Item } from '../../screens/OnboardingScreen';
import { fonts, theme } from '../../theme';
import { ARButton, ARButtonSize } from './ARButton';

const dimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    height: dimensions.height * 0.1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 50,
    backgroundColor: theme.colors.white,
    opacity: 0.6,
    marginRight: 5,
  },
});

interface Props {
  slides: Item[];
  currentIndex: number;
  handleNextSlide: () => void;
}

const ARSlideFooter = ({ slides, currentIndex, handleNextSlide }: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <View style={{ flexDirection: 'row' }}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index && { opacity: 1 },
              ]}
            />
          ))}
        </View>
        {currentIndex + 1 === slides.length ? (
          <ARButton
            label={"Continuer"}
            size={ARButtonSize.Small}
            onPress={handleNextSlide}
            styleContainer={{ backgroundColor: 'white' }}
            labelStyle={{ color: theme.colors.primary, ...fonts.Lato.semibold }}
          />
        ) : (
          <ARButton
            isReversed
            label={'Suivant'}
            size={ARButtonSize.Small}
            onPress={handleNextSlide}
            styleContainer={{ backgroundColor: 'white' }}
            labelStyle={{ color: theme.colors.primary, ...fonts.Lato.semibold }}
            icon={() => {
              return (
                <SvgXml
                  width="29"
                  height="8"
                  xml={buttonIcon}
                  fill={theme.colors.primary}
                />
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default ARSlideFooter;
