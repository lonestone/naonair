import MapboxGL, {LineLayerStyle} from '@react-native-mapbox-gl/maps';
import React, {RefObject, useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {
  flushSnapshots,
  getAll,
  getMapSnapshot,
  Route,
  saveMapSnapshot,
} from '../../actions/routes';
import ARMap from '../atoms/ARMap';

const lineStyle: LineLayerStyle = {
  lineColor: 'red',
  lineWidth: 2,
  lineJoin: 'round',
  lineCap: 'round',
};

export default () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [index, setIndex] = useState(0);

  const [base64, setBase64] = useState<string[]>([]);

  useEffect(() => {
    getAll().then(setRoutes);
  }, []);

  const retreiveSnapshot = useCallback(() => {
    console.log('get snapshots');
    Promise.all(
      routes.map(route =>
        getMapSnapshot(route.name).catch(e => {
          console.log(e);
        }),
      ),
    )
      .then(setBase64)
      .catch(e => console.log(e));
  }, [routes]);

  useEffect(() => {
    retreiveSnapshot();
  }, [retreiveSnapshot]);

  const gatheringSnapshots = async (
    mapRef: RefObject<MapboxGL.MapView>,
    index: number,
  ) => {
    console.log('Take Snap', index);
    await new Promise(resolve => setTimeout(resolve, 500)); // need to make sure the map is correctly loaded
    const img = await mapRef.current?.takeSnap(false);

    img && saveMapSnapshot(routes[index].name, img);

    if (index + 1 >= routes.length) {
      // setIndex(0);
      return;
    }

    setIndex(index + 1);
    // await new Promise(resolve => setTimeout(resolve, 500));
    gatheringSnapshots(mapRef, index + 1);
  };

  const onMapLoaded = async (mapRef: RefObject<MapboxGL.MapView>) => {
    await gatheringSnapshots(mapRef, index);
    console.log('done');
  };

  const flush = async () => {
    try {
      await flushSnapshots();
    } catch (e) {
      console.warn(e);
    }
  };

  if (routes.length === 0) {
    return null;
  }

  console.log(routes.length, index);
  const {bounds, center, geojson} = routes[index];

  return (
    <View style={{flex: 1}}>
      <View style={{height: 160, opacity: 1}}>
        <ARMap
          bounds={bounds}
          cameraPadding={{
            paddingBottom: 20,
            paddingLeft: 20,
            paddingTop: 20,
            paddingRight: 20,
          }}
          // center={center}
          onMapLoaded={onMapLoaded}>
          <MapboxGL.ShapeSource id="source1" lineMetrics={true} shape={geojson}>
            <MapboxGL.LineLayer id="layer1" style={lineStyle} />
          </MapboxGL.ShapeSource>
        </ARMap>
      </View>

      <View style={{position: 'absolute'}}></View>

      <Text>PREVIEW:</Text>
      <Button onPress={flush}>Flush snapShot</Button>
      <ScrollView style={{height: 400}}>
        {base64.map((uri, index) => (
          <Image
            key={`img-${index}`}
            style={{height: 160, backgroundColor: 'green'}}
            resizeMode="contain"
            source={{uri}}
          />
        ))}
      </ScrollView>
    </View>
  );
};
