import MapboxGL, {
  CameraSettings,
  RasterSourceProps,
} from '@react-native-mapbox-gl/maps';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  map: {flex: 1},
});

const styleJSON = JSON.stringify(require('../../mapViewStyle.json'));

const defaultSettingsCamera: CameraSettings = {
  zoomLevel: 14,
  centerCoordinate: [-1.56857384817453, 47.20300691709389],
};

const rasterSourceProps: RasterSourceProps = {
  id: 'aireel_source',
  tileUrlTemplates: [
    'https://data.airpl.org/geoserver/aireel/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/jpeg&TRANSPARENT=true&STYLES=&LAYERS=aireel:aireel_indic_7m_atmo_deg&SRS=EPSG:3857&WIDTH=768&HEIGHT=497&BBOX={bbox-epsg-3857}',
  ],
  tileSize: 256,
};

export interface ARMapProps extends ViewProps {
  userLocationVisible?: boolean;
  heatmapVisible?: boolean;
  interactionEnabled?: boolean;
}

export default ({
  userLocationVisible,
  heatmapVisible,
  interactionEnabled,
  children,
}: ARMapProps) => {
  const cameraRef = React.createRef<MapboxGL.Camera>();

  useEffect(() => {
    // if we don't call this methods, MapboxGL crash on Android
    MapboxGL.setAccessToken('');
  });

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        // styleURL="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json" // leave it for now if we need to use this style
        // styleURL="https://geoserveis.icgc.cat/contextmaps/positron.json" // same as `styleJSON`, but I prefer to keep the URL to prevent finding it if we decided to use it
        styleJSON={styleJSON}
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        rotateEnabled={false}
        zoomEnabled={!!interactionEnabled}
        scrollEnabled={!!interactionEnabled}>
        <MapboxGL.Camera
          ref={cameraRef}
          defaultSettings={defaultSettingsCamera}
        />
        {userLocationVisible ? (
          <MapboxGL.UserLocation
            visible
            renderMode="native"
            animated
            showsUserHeadingIndicator
            onUpdate={location => {
              cameraRef.current?.moveTo([
                location.coords.longitude,
                location.coords.latitude,
              ]);
            }}
          />
        ) : null}
        {heatmapVisible ? (
          <MapboxGL.RasterSource {...rasterSourceProps}>
            <MapboxGL.RasterLayer
              id="airreel_layer"
              aboveLayerID="landcover_glacier" // used to force the layer to draw below roads and buildings
              sourceID="aireel_source"
            />
          </MapboxGL.RasterSource>
        ) : null}
        {children || null}
      </MapboxGL.MapView>
    </View>
  );
};
