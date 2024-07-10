import { Position } from 'geojson';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { TextInput } from 'react-native-paper';
import { geocoding, getAll, POI, reverse } from '../../actions/poi';
import { theme } from '@theme';

// Gouv API usage
// https://adresse.data.gouv.fr/api-doc/adresse

const styles = StyleSheet.create({
  inputContainer: {
    flexWrap: 'nowrap',
    textAlign: 'auto',
    backgroundColor: theme.colors.white,
  },
});

export interface ARAddressInputProps {
  value?: { coord: Position; text: string };
  label: string;
  placeholder?: string;
  onResults?: (results: POI[]) => void;
  onFocus?: () => void;
  onUserLocation?: (coord: Position, text: string) => void;
  onTextChanged?: () => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default ({
  label,
  value,
  placeholder,
  style,
  onResults,
  onFocus,
  onUserLocation,
  onTextChanged,
  onClear,
}: ARAddressInputProps) => {
  const [text, setText] = useState('');
  const [results, setResults] = useState<POI[]>([]);
  const [isValid, setIsValid] = useState(true);

  const searchTimeout = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (value) {
      setText(value.text);
      setIsValid(true);
    } else if (!value) {
      text.length > 0 ? setIsValid(false) : setIsValid(true);
    }
  }, [value, text]);

  useEffect(() => {
    onResults && onResults(results);
  }, [results, onResults]);

  const reverseValue = async (position: Position) => {
    const features = await reverse(position);
    if (features.length > 0) {
      const { text_fr = 'Ma position' } = features[0];
      setText(text_fr);
      onUserLocation && onUserLocation(position, text_fr);
    }
  };

  const onChangeText = (newValue: string) => {
    setText(newValue);

    onTextChanged?.();

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      const features = [
        ...(await getAll({ text: newValue })),
        ...(await geocoding(newValue)),
      ];
      setResults(features);
    }, 500) as unknown as number;
  };

  const handleClearValues = useCallback(() => {
    setText('');
    onClear?.();
    setResults([]);
  }, [onClear]);

  return (
    <>
      <TextInput
        mode="outlined"
        activeOutlineColor={theme.colors.outlineFocused}
        outlineColor={
          isValid ? theme.colors.outlineDisabled : theme.colors.quality.main.red
        }
        multiline={false}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.blue[400]}
        textContentType="addressCity"
        label={label}
        accessibilityLabel={label}
        style={StyleSheet.flatten([styles.inputContainer, style])}
        value={text}
        onChangeText={onChangeText}
        onFocus={() => {
          onFocus && onFocus();
        }}
        right={
          <TextInput.Icon
            name={text !== '' ? 'close' : 'target'}
            forceTextInputFocus={text !== ''}
            color={theme.colors.blue[500]}
            accessibilityLabel={
              text !== '' ? 'Supprimer la recherche' : 'Me localiser'
            }
            onPress={() => {
              if (text !== '') {
                handleClearValues();
              } else {
                Geolocation.getCurrentPosition(({ coords }) => {
                  reverseValue([coords.longitude, coords.latitude]);
                });
              }
            }}
          />
        }
      />
    </>
  );
};
