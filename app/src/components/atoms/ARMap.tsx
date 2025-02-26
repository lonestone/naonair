import MapLibreGL, {
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
  useMemo,
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

const styleJSON = require('../../assets/db/mapViewStyle.json');

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
  onUserLocationChanged?: (location: MapLibreGL.Location) => void;
  onMapLoaded?: (
    mapRef: RefObject<MapLibreGL.MapView>,
    cameraRef: RefObject<MapLibreGL.Camera>,
  ) => void;
  onCameraChanged?: () => void;
}

export interface ARMapHandle {
  setCamera: (settings: CameraSettings) => void;
  viewRef: RefObject<MapLibreGL.MapView>;
}

if (Platform.OS === 'android') {
  MapLibreGL.requestAndroidLocationPermissions();
}

MapLibreGL.OfflineManager.clearAmbientCache();

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
  const cameraRef = createRef<MapLibreGL.Camera>();
  const mapRef = createRef<MapLibreGL.MapView>();
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

  const mergedCameraSettings = useMemo(() => {
    let result = {
      ...defaultSettingsCamera,
      ...cameraSettings,
    };
    if (bounds) {
      // "Create a camera stop with bounds and centerCoordinate – this is not possible."
      result.bounds = bounds;
      result.centerCoordinate = undefined;
    }
    return result;
  }, [bounds, cameraSettings]);

  return (
    <>
      <View style={StyleSheet.flatten([styles.container, style])}>
        <MapLibreGL.MapView
          // mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json" // leave it for now if we need to use this style
          // mapStyle="https://geoserveis.icgc.cat/contextmaps/positron.json" // same as `styleJSON`, but I prefer to keep the URL to prevent finding it if we decided to use it
          ref={mapRef}
          mapStyle={styleJSON}
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
          <MapLibreGL.Camera
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
            defaultSettings={mergedCameraSettings}
          />
          {userLocationVisible && (
            <MapLibreGL.UserLocation
              visible={userLocationVisible}
              renderMode="native"
              androidRenderMode={isGPS ? 'gps' : 'normal'}
              animated
              showsUserHeadingIndicator
              onUpdate={onUserLocationChanged}
            />
          )}
          {heatmapVisible && (
            <MapLibreGL.RasterSource {...rasterSourceProps}>
              <MapLibreGL.RasterLayer
                id="airreel_layer"
                aboveLayerID="place_country_major" // used to force the layer to draw below roads and buildings
                sourceID="aireel_source"
                style={{ rasterOpacity: 0.6 }}
              />
            </MapLibreGL.RasterSource>
          )}
          {(isLoadedFully && children) || null}
        </MapLibreGL.MapView>
      </View>
    </>
  );
};

export default forwardRef<ARMapHandle, ARMapProps>(ARMap);
