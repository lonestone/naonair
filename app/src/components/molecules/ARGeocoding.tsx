import {Feature, Point, Position} from 'geojson';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Surface, Text, TextInput} from 'react-native-paper';
import {geocoding, reverse} from '../../actions/poi';

// Gouv API usage
// https://adresse.data.gouv.fr/api-doc/adresse

const styles = StyleSheet.create({
  resultsContainer: {
    height: 150,
    left: 0,
    right: 0,
    zIndex: 420000,
    position: 'absolute',
  },
});

export interface ARGeocodingProps {
  value?: Position;
  label: string;
  placeholder?: string;
  onResults?: (results: Feature[]) => void;
  onFocus?: () => void;
}

export default ({label, value, placeholder, onResults}: ARGeocodingProps) => {
  const [didMount, setDidMount] = useState(false);
  const [text, setText] = useState<string>('');
  const [results, setResults] = useState<Feature[]>([]);

  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    setDidMount(true);
  }, []);

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
        placeholder={placeholder}
        label={label}
        style={{position: 'relative', zIndex: -1}}
        value={text}
        onChangeText={onChangeText}
      />
      {/* <View> */}
      {/* {showResults && (
          <Surface style={styles.resultsContainer}>
            <ScrollView>
              {(results || []).map(result => (
                <Text>{result.properties?.label}</Text>
              ))}
            </ScrollView>
          </Surface>
        )} */}
      {/* </View> */}
    </>
  );
};
