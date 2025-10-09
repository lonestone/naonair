import ARPOIDetails from '@templates/ARPOIDetails';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getAll, POI } from '../../actions/poi';

interface POIDetailsWrapperProps {
  route: any;
}

const POIDetailsWrapper: React.FC<POIDetailsWrapperProps> = ({ route }) => {
  const [poi, setPoi] = useState<POI | null>(null);
  const [loading, setLoading] = useState(false);
  const { poi: directPoi, poiId, id } = route.params || {};
  const actualPoiId = poiId || id; // Utiliser poiId ou id selon ce qui est disponible

  console.log('[DEEP LINK] POIDetailsWrapper received route.params:', JSON.stringify(route.params, null, 2));
  console.log('[DEEP LINK] POIDetailsWrapper actualPoiId:', actualPoiId);

  useEffect(() => {
    if (directPoi) {
      console.log('[DEEP LINK] Using directPoi:', directPoi);
      setPoi(directPoi);
    } else if (actualPoiId) {
      console.log('[DEEP LINK] Fetching POI with ID:', actualPoiId);
      setLoading(true);
      getAll()
        .then((allPois) => {
          console.log('[DEEP LINK] Received', allPois.length, 'POIs from API');
          const fetchedPoi = allPois.find(p => p.poi_id === parseInt(actualPoiId));
          if (fetchedPoi) {
            console.log('[DEEP LINK] Found matching POI:', fetchedPoi.poi_id);
            setPoi(fetchedPoi);
          } else {
            console.log('[DEEP LINK] No matching POI found for ID:', actualPoiId);
          }
        })
        .catch((error) => {
          console.error('[DEEP LINK] Error fetching POI:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('[DEEP LINK] No POI ID provided in params');
    }
  }, [directPoi, actualPoiId]);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }

  if (!poi) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>POI not found : {actualPoiId || 'no ID'}</Text></View>;
  }

  // Vérification de sécurité supplémentaire
  if (!poi || typeof poi !== 'object' || !poi.id) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>POI invalide</Text></View>;
  }

  // Vérification que le POI a bien la propriété favorited
  if (typeof poi.favorited === 'undefined') {
    poi.favorited = false;
  }

  return <ARPOIDetails poi={poi} />;
};

export default POIDetailsWrapper;
