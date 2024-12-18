import MapboxGL, {
  CameraPadding,
  CameraSettings,
  RasterSourceProps,
} from '@maplibre/maplibre-react-native';
import { BBox, Position } from 'geojson';
import React, {
  createRef,
  forwardRef,
  Ref,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GEOSERVER } from '../../config.json';

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
    `${GEOSERVER.baseUrl}/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/jpeg&TRANSPARENT=true&STYLES=&LAYERS=aireel:aireel_indic_7m_atmo_deg&SRS=EPSG:3857&WIDTH=768&HEIGHT=497&BBOX={bbox-epsg-3857}`,
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
  isGPS?: boolean;
  cameraSettings?: CameraSettings;
  animationMode?: 'flyTo' | 'easeTo' | 'linearTo' | 'moveTo';
  onUserLocationChanged?: (location: MapboxGL.Location) => void;
  onMapLoaded?: (
    mapRef: RefObject<MapboxGL.MapView>,
    cameraRef: RefObject<MapboxGL.Camera>,
  ) => void;
  onCameraChanged?: () => void;
}

export interface ARMapHandle {
  setCamera: (settings: CameraSettings) => void;
  viewRef: RefObject<MapboxGL.MapView>;
}

// if we don't call this methods, MapboxGL crash on Android
MapboxGL.setAccessToken('');

if (Platform.OS === 'android') {
  MapboxGL.requestAndroidLocationPermissions();
}

MapboxGL.offlineManager.clearAmbientCache();

const ARMap = (
  {
    userLocationVisible,
    heatmapVisible,
    interactionEnabled,
    children,
    bbox,
    center,
    onMapPress,
    cameraSettings,
    animationMode,
    isGPS,
    onUserLocationChanged,
    onMapLoaded,
    onCameraChanged,
    style,
  }: ARMapProps,
  ref: Ref<ARMapHandle>,
) => {
  const cameraRef = createRef<MapboxGL.Camera>();
  const mapRef = createRef<MapboxGL.MapView>();
  const [isLoadedFully, setLoadedFully] = useState(false);

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
    viewRef: mapRef,
  }));

  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={StyleSheet.flatten([styles.container, style])}>
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
          surfaceView
          onPress={() => onMapPress && onMapPress()}
          onDidFinishRenderingMapFully={() => {
            onMapLoaded && onMapLoaded(mapRef, cameraRef);
            setLoadedFully(true);
          }}
          onRegionDidChange={onCameraChanged}
          zoomEnabled={!!interactionEnabled}
          scrollEnabled={!!interactionEnabled}>
          <MapboxGL.Camera
            ref={cameraRef}
            bounds={bounds}
            centerCoordinate={center}
            minZoomLevel={8}
            padding={{
              paddingBottom: 25 + insets.bottom,
              paddingLeft: 25 + insets.left,
              paddingRight: 25 + insets.right,
              paddingTop: 25 + insets.top,
            }}
            animationMode={animationMode || 'moveTo'}
            defaultSettings={{
              ...defaultSettingsCamera,
              ...cameraSettings,
              bounds,
            }}
          />
          {userLocationVisible && (
            <MapboxGL.UserLocation
              visible={userLocationVisible}
              renderMode="native"
              androidRenderMode={isGPS ? 'gps' : 'normal'}
              animated
              showsUserHeadingIndicator
              onUpdate={onUserLocationChanged}
            />
          )}
          {heatmapVisible && (
            <MapboxGL.RasterSource {...rasterSourceProps}>
              <MapboxGL.RasterLayer
                id="airreel_layer"
                aboveLayerID="place_country_major" // used to force the layer to draw below roads and buildings
                sourceID="aireel_source"
                style={{ rasterOpacity: 0.6 }}
              />
            </MapboxGL.RasterSource>
          )}
          {(isLoadedFully && children) || null}
        </MapboxGL.MapView>
      </View>
    </>
  );
};

export default forwardRef<ARMapHandle, ARMapProps>(ARMap);
