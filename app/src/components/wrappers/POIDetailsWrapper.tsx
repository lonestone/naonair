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

  useEffect(() => {
    if (directPoi) {
      setPoi(directPoi);
    } else if (actualPoiId) {
      setLoading(true);
      getAll()
        .then((allPois) => {
          const fetchedPoi = allPois.find(p => p.poi_id === parseInt(actualPoiId));
          if (fetchedPoi) {
            setPoi(fetchedPoi);
          }
        })
        .catch((error) => {
          console.error('Error fetching POI:', error);
        })
        .finally(() => {
          setLoading(false);
        });
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
