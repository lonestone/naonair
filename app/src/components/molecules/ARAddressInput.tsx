import Geolocation from '@react-native-community/geolocation';
import { Position } from 'geojson';
import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { geocoding, MapboxFeature, reverse } from '../../actions/poi';
import { theme } from '../../theme';

// Gouv API usage
// https://adresse.data.gouv.fr/api-doc/adresse

const styles = StyleSheet.create({
  inputContainer: {
    flexWrap: 'nowrap',
    textAlign: 'auto',
  },
});

export interface ARAddressInputProps {
  value?: { coord: Position; text: string };

  label: string;
  placeholder?: string;
  onResults?: (results: MapboxFeature[]) => void;
  onFocus?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default ({
  label,
  value,
  placeholder,
  style,
  onResults,
  onFocus,
}: ARAddressInputProps) => {
  const [text, setText] = useState<string>(value?.text || '');
  const [results, setResults] = useState<MapboxFeature[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    setText(value?.text || '');
  }, [value]);

  useEffect(() => {
    onResults && onResults(results);
  }, [results, onResults]);

  const reverseValue = async (position: Position) => {
    const features = await reverse(position);
    console.info(features);
    if (features.length > 0) {
      setText(features[0].properties?.text_fr);
    }
  };

  const onChangeText = (newValue: string) => {
    setText(newValue);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      const features = await geocoding(newValue);
      setResults(features);
    }, 500) as unknown as number;
  };

  return (
    <>
      <TextInput
        mode="outlined"
        outlineColor={
          isFocused ? theme.colors.outlineFocused : theme.colors.outlineDisabled
        }
        multiline={false}
        placeholder={placeholder}
        textContentType="addressCity"
        label={label}
        style={StyleSheet.flatten([styles.inputContainer, style])}
        value={text}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          onFocus && onFocus();
        }}
        onBlur={() => setIsFocused(false)}
        right={
          <TextInput.Icon
            name={text !== '' ? 'close' : 'target'}
            forceTextInputFocus={text !== ''}
            onPress={() => {
              text !== ''
                ? setText('')
                : Geolocation.getCurrentPosition(({ coords }) => {
                    console.info(coords);
                    reverseValue([coords.longitude, coords.latitude]);
                  });
            }}
          />
        }
      />
    </>
  );
};
