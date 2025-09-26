import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { QrCode } from "@mui/icons-material";
import { POI, getPOIs } from "../../api/poi.api";
import ARTitleBlock from "../molecules/ARTitleBlock";
import POIQRCodeItem from "../molecules/POIQRCodeItem";

export const QRCodeTemplate: React.FC = () => {
  const [pois, setPOIs] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPOIs = async () => {
    try {
      setLoading(true);
      const poisData = await getPOIs();
      setPOIs(poisData);
    } catch (err) {
      setError("Erreur lors du chargement des points d'intérêt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOIs();
  }, []);

  return (
    <>
      <ARTitleBlock />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <QrCode sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            QR Codes des Points d'Intérêt
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Générez et téléchargez les QR codes associés aux points d'intérêt pour
          les utiliser sur des supports physiques ou numériques. Les QR codes sont
          disponibles aux formats PNG (fond transparent) et SVG.
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {pois.length} point{pois.length > 1 ? 's' : ''} d'intérêt disponible{pois.length > 1 ? 's' : ''}
            </Typography>

            {pois.map((poi) => (
              <POIQRCodeItem key={poi.poi_id} poi={poi} />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};