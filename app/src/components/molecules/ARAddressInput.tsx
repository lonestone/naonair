import { Feature, Position } from 'geojson';
import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { geocoding, reverse } from '../../actions/poi';
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
}: ARAddressInputProps) => {
  const [text, setText] = useState<string>('');
  const [results, setResults] = useState<Feature[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (value) {
      reverseValue(value);
    }
  }, [value]);

  useEffect(() => {
    onResults && onResults(results);
  }, [results, onResults]);

  const reverseValue = async (position: Position) => {
    const { features } = await reverse(position);
    if (features.length > 0) {
      setText(features[0].properties?.label);
    }
  };

  const onChangeText = (newValue: string) => {
    setText(newValue);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      const { features } = await geocoding(newValue);
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
      />
    </>
  );
};
