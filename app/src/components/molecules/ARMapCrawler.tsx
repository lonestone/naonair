import MapboxGL, { LineLayerStyle } from '@react-native-mapbox-gl/maps';
import React, { RefObject, useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import {
  flushSnapshots,
  getMapSnapshot,
  saveMapSnapshot,
} from '../../actions/routes';
import ARMap from '../atoms/ARMap';
import { getAll, ARParcours } from '../../actions/parcours';

const lineStyle: LineLayerStyle = {
  lineColor: '#25244E',
  lineWidth: 4,
  lineJoin: 'round',
  lineCap: 'round',
};

let timeoutId: number | undefined = undefined;

export default () => {
  const [routes, setRoutes] = useState<ARParcours[]>([]);
  const [index, setIndex] = useState(0);

  const [base64, setBase64] = useState<string[]>([]);

  useEffect(() => {
    getAll().then(setRoutes);
  }, []);

  const retreiveSnapshot = useCallback(() => {
    if (routes.length == 0) {
      return;
    }

    console.log('get snapshots');
    Promise.all(routes.map(route => getMapSnapshot(route.properties.nom)))
      .then(results => results.filter(result => !!result) as string[])
      .then(setBase64)
      .catch(e => console.log(e));
  }, [routes]);

  useEffect(() => {
    retreiveSnapshot();
  }, [retreiveSnapshot, routes]);

  const gatheringSnapshots = useCallback(
    async (mapRef: RefObject<MapboxGL.MapView>) => {
      console.log('Take Snap', index);
      // await new Promise(resolve => setTimeout(resolve, 500)); // need to make sure the map is correctly loaded
      const img = await mapRef.current?.takeSnap(false);

      console.info(img);
      img && (await saveMapSnapshot(routes[index].properties.nom, img));

      if (index + 1 >= routes.length) {
        retreiveSnapshot();
        return;
      }

      setIndex(index + 1);
      // await new Promise(resolve => setTimeout(resolve, 500));
      // gatheringSnapshots(mapRef, index + 1);
    },
    [index, retreiveSnapshot, routes],
  );

  // useEffect(() => {
  //   if (!mapRefState || isMapLoaded === false || routes.length === 0) {
  //     return;
  //   }

  // }, [isMapLoaded, routes, mapRefState, gatheringSnapshots]);

  const onMapLoaded = async (mapRef: RefObject<MapboxGL.MapView>) => {
    if (timeoutId) {
      clearInterval(timeoutId);
    }

    timeoutId = setTimeout(() => {
      gatheringSnapshots(mapRef);
    }, 200) as unknown as number;
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

  console.log(routes[index], index);
  const { bbox, center, geometry } = routes[index];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 160, opacity: 1 }}>
        <ARMap
          bbox={bbox}
          // cameraPadding={{
          //   paddingBottom: 20,
          //   paddingLeft: 20,
          //   paddingTop: 20,
          //   paddingRight: 20,
          // }}
          // center={center}
          onFrameLoaded={onMapLoaded}>
          <MapboxGL.ShapeSource
            id="source1"
            lineMetrics={true}
            shape={geometry}>
            <MapboxGL.LineLayer id="layer1" style={lineStyle} />
          </MapboxGL.ShapeSource>
        </ARMap>
      </View>

      <View style={{ position: 'absolute' }}>
        <Button onPress={flush}>Flush snapShot</Button>
      </View>

      <Text>PREVIEW:</Text>
      <Button onPress={flush}>Flush snapShot</Button>
      <ScrollView style={{ height: 400 }}>
        {base64.map((uri, index) => (
          <Image
            key={`img-${index}`}
            style={{ height: 160, backgroundColor: 'green' }}
            resizeMode="contain"
            source={{ uri }}
          />
        ))}
      </ScrollView>
    </View>
  );
};
