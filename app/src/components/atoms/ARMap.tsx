import MapboxGL, {
  CameraPadding,
  CameraSettings,
  RasterSourceProps,
} from '@react-native-mapbox-gl/maps';
import { BBox, Position } from 'geojson';
import React, {
  forwardRef,
  Ref,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  map: { flex: 1 },
});

const styleJSON = JSON.stringify(require('../../assets/db/mapViewStyle.json'));

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
  bbox?: BBox;
  center?: Position;
  onMapPress?: () => void;
  onUserLocationChanged?: (location: MapboxGL.Location) => void;
  onMapLoaded?: (
    mapRef: RefObject<MapboxGL.MapView>,
    cameraRef: RefObject<MapboxGL.Camera>,
  ) => void;
}

export interface ARMapHandle {
  setCamera: (settings: CameraSettings) => void;
}

MapboxGL.setAccessToken('');

if (Platform.OS === 'android') {
  // we have to call this method if we want the user location
  MapboxGL.requestAndroidLocationPermissions();
}

const ARMap = (
  {
    userLocationVisible,
    heatmapVisible,
    interactionEnabled,
    children,
    bbox,
    center,
    onMapPress,
    onUserLocationChanged,
    onMapLoaded,
  }: ARMapProps,
  ref: Ref<ARMapHandle>,
) => {
  const cameraRef = React.createRef<MapboxGL.Camera>();
  const mapRef = React.createRef<MapboxGL.MapView>();

  const [bounds, setBounds] = useState<
    CameraPadding & { ne: Position; sw: Position }
  >();

  useEffect(() => {
    bbox &&
      setBounds({
        ne: [bbox[0], bbox[1]],
        sw: [bbox[2], bbox[3]],
      });
  }, [bbox]);

  useImperativeHandle(ref, () => ({
    setCamera: (settings: CameraSettings) => {
      cameraRef.current?.setCamera(settings);
    },
  }));

  // useEffect(() => {
  //   onMapLoaded && onMapLoaded(mapRef, cameraRef);
  // }, [cameraRef, mapRef, onMapLoaded]);

  useEffect(() => {
    // if we don't call this methods, MapboxGL crash on Android
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        // styleURL="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json" // leave it for now if we need to use this style
        // styleURL="https://geoserveis.icgc.cat/contextmaps/positron.json" // same as `styleJSON`, but I prefer to keep the URL to prevent finding it if we decided to use it
        ref={mapRef}
        styleJSON={styleJSON}
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={() => onMapPress && onMapPress()}
        // surfaceView
        onDidFinishRenderingMapFully={() =>
          onMapLoaded && onMapLoaded(mapRef, cameraRef)
        }
        zoomEnabled={!!interactionEnabled}
        scrollEnabled={!!interactionEnabled}>
        <MapboxGL.Camera
          ref={cameraRef}
          bounds={bounds}
          centerCoordinate={center}
          padding={{
            paddingBottom: 25 + insets.bottom,
            paddingLeft: 25 + insets.left,
            paddingRight: 25 + insets.right,
            paddingTop: 25 + insets.top,
          }}
          animationMode="moveTo"
          defaultSettings={{
            ...defaultSettingsCamera,
            bounds,
          }}
        />
        {userLocationVisible ? (
          <MapboxGL.UserLocation
            visible
            renderMode="native"
            animated
            showsUserHeadingIndicator
            onUpdate={onUserLocationChanged}
            // onUpdate={location => {
            // cameraRef.current?.moveTo([
            //   location.coords.longitude,
            //   location.coords.latitude,
            // ]);
            // }}
          />
        ) : null}
        {heatmapVisible && (
          <MapboxGL.RasterSource {...rasterSourceProps}>
            <MapboxGL.RasterLayer
              id="airreel_layer"
              aboveLayerID="landcover_glacier" // used to force the layer to draw below roads and buildings
              sourceID="aireel_source"
            />
          </MapboxGL.RasterSource>
        )}
        {children || null}
      </MapboxGL.MapView>
    </View>
  );
};

export default forwardRef<ARMapHandle, ARMapProps>(ARMap);
