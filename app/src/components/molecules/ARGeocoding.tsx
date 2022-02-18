import {Feature} from 'geojson';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Surface, Text, TextInput} from 'react-native-paper';
import {geocoding} from '../../actions/poi';

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
  value?: string;
  label: string;
  placeholder?: string;
  onResults?: (results: Feature[]) => void;
}

export default ({label, value, placeholder, onResults}: ARGeocodingProps) => {
  const [text, setText] = useState<string>(value || '');
  const [results, setResults] = useState<Feature[]>([]);

  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    onResults && onResults(results);
  }, [results, onResults]);

  useEffect(() => {
    console.info('new text', text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      geocoding(text).then(({features}) => {
        console.info(features);
        setResults(features);
      });
    }, 500) as unknown as number;
  }, [text]);

  return (
    <>
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        label={label}
        style={{position: 'relative', zIndex: -1}}
        value={text}
        onChangeText={setText}
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
