import MapboxGL, {LineLayerStyle} from '@react-native-mapbox-gl/maps';
import React, {createRef, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {getAll} from '../../actions/routes';
import ARMap from '../atoms/ARMap';

const lineStyle: LineLayerStyle = {
  lineColor: 'red',
  lineWidth: 2,
  lineJoin: 'round',
  lineCap: 'round',
};

// const parcours = getAll();

export default () => {
  // const [index, setIndex] = useState(0);

  const [base64, setBase64] = useState<string | null>(null);
  // console.info(parcours);

  return (
    <View style={{flex: 1}}>
      <ARMap
        userLocationVisible
        interactionEnabled
        onMapLoaded={(mapRef, cameraRef) => {
          mapRef.current?.takeSnap(false).then(temp => {
            console.info(temp);
            setBase64(temp);
          });
        }}></ARMap>

      <Text>PREVIEW:</Text>
      {base64 ? <Image style={{height: 400}} source={{uri: base64}} /> : null}
    </View>
  );
};

// <ARMap
// // userLocationVisible
// // interactionEnabled
// // ref={mapRef}
// onMapLoaded={() => {
//   // mapRef.current?.takeSnap(false).then(uri => {
//   //   console.info(uri);
//   // });
// }}>
// {/* <MapboxGL.ShapeSource
//   id="source1"
//   lineMetrics={true}
//   shape={{
//     type: 'Feature',
//     geometry: {
//       type: 'LineString',
//       coordinates: [
//         [-77.044211, 38.852924],
//         [-77.045659, 38.860158],
//         [-77.044232, 38.862326],
//         [-77.040879, 38.865454],
//         [-77.039936, 38.867698],
//         [-77.040338, 38.86943],
//         [-77.04264, 38.872528],
//         [-77.03696, 38.878424],
//         [-77.032309, 38.87937],
//         [-77.030056, 38.880945],
//         [-77.027645, 38.881779],
//         [-77.026946, 38.882645],
//         [-77.026942, 38.885502],
//         [-77.028054, 38.887449],
//         [-77.02806, 38.892088],
//         [-77.03364, 38.892108],
//         [-77.033643, 38.899926],
//       ],
//     },
//   }}>
//   <MapboxGL.LineLayer id="layer1" />
// </MapboxGL.ShapeSource> */}
// </ARMap>
