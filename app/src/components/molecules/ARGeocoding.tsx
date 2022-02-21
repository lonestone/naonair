import {Feature, Position} from 'geojson';
import React, {useEffect, useRef, useState} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {TextInput} from 'react-native-paper';
import {geocoding, reverse} from '../../actions/poi';
import {theme} from '../../theme';

// Gouv API usage
// https://adresse.data.gouv.fr/api-doc/adresse

const styles = StyleSheet.create({
  inputContainer: {},
});

export interface ARGeocodingProps {
  value?: Position;
  label: string;
  placeholder?: string;
  onResults?: (results: Feature[]) => void;
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
}: ARGeocodingProps) => {
  const [text, setText] = useState<string>('');
  const [results, setResults] = useState<Feature[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (value) {
      reverse(value!).then(({features}) => {
        if (features.length > 0) {
          setText(features[0].properties?.label);
        }
      });
    }
  }, [value]);

  useEffect(() => {
    onResults && onResults(results);
  }, [results, onResults]);

  const onChangeText = (newValue: string) => {
    console.info('new text', newValue);

    setText(newValue);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      geocoding(newValue).then(({features}) => {
        console.info(features);
        setResults(features);
      });
    }, 500) as unknown as number;
  };

  return (
    <>
      <TextInput
        mode="outlined"
        outlineColor={
          isFocused ? theme.colors.outlineFocused : theme.colors.outlineDisabled
        }
        placeholder={placeholder}
        label={label}
        style={StyleSheet.flatten([styles.inputContainer, style])}
        value={text}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          onFocus && onFocus();
        }}
        onBlur={() => setIsFocused(false)}
      />
    </>
  );
};
