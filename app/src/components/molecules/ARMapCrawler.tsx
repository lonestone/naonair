import MapboxGL, {LineLayerStyle} from '@react-native-mapbox-gl/maps';
import React, {RefObject, useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {
  flushSnapshots,
  getAll,
  getMapSnapshot,
  saveMapSnapshot,
} from '../../actions/routes';
import ARMap from '../atoms/ARMap';

const lineStyle: LineLayerStyle = {
  lineColor: 'red',
  lineWidth: 2,
  lineJoin: 'round',
  lineCap: 'round',
};

const parcours = getAll();

export default () => {
  // const [index, setIndex] = useState(0);

  const [base64, setBase64] = useState<string | null>(null);

  useEffect(() => {
    getMapSnapshot('je-suis-un-test')
      .then(setBase64)
      .catch(e => console.log(e));
  }, []);

  const onMapLoaded = async (mapRef: RefObject<MapboxGL.MapView>) => {
    const timeout = new Promise(resolve => setTimeout(resolve, 200));
    await timeout; // need to make sure the map is correctly
    const img = await mapRef.current?.takeSnap(false);

    console.info(img);

    img && saveMapSnapshot('je-suis-un-test', img);
  };

  const flush = async () => {
    try {
      await flushSnapshots();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: 160, width: 160, opacity: 1}}>
        <ARMap userLocationVisible interactionEnabled onMapLoaded={onMapLoaded}>
          <MapboxGL.ShapeSource
            id="source1"
            lineMetrics={true}
            shape={parcours[0]}>
            <MapboxGL.LineLayer id="layer1" style={lineStyle} />
          </MapboxGL.ShapeSource>
        </ARMap>
      </View>

      <View style={{position: 'absolute'}}></View>

      <Text>PREVIEW:</Text>
      <Button onPress={flush}>Flush snapShot</Button>
      {base64 ? <Image style={{height: 400}} source={{uri: base64}} /> : null}
    </View>
  );
};
