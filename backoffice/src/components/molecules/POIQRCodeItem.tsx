import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Download, QrCode, Visibility, Close } from "@mui/icons-material";
import { POI, downloadQRCode } from "../../api/poi.api";

interface POIQRCodeItemProps {
  poi: POI;
}

const POIQRCodeItem: React.FC<POIQRCodeItemProps> = ({ poi }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const handleDownload = async (format: 'png' | 'svg') => {
    try {
      const blob = await downloadQRCode(poi.poi_id, format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `poi-${poi.poi_id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Erreur lors du téléchargement du QR code');
    }
  };

  const handlePreview = async () => {
    try {
      const blob = await downloadQRCode(poi.poi_id, 'png');
      const url = window.URL.createObjectURL(blob);
      setQrCodeUrl(url);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error loading QR code preview:', error);
      alert('Erreur lors du chargement de la prévisualisation');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (qrCodeUrl) {
      window.URL.revokeObjectURL(qrCodeUrl);
      setQrCodeUrl('');
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {poi.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {poi.address}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                label={poi.category}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`ID: ${poi.poi_id}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              onClick={handlePreview}
              sx={{ minWidth: '120px' }}
            >
              Prévisualiser
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Download />}
              onClick={() => handleDownload('png')}
              sx={{ minWidth: '120px' }}
            >
              PNG
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<QrCode />}
              onClick={() => handleDownload('svg')}
              sx={{ minWidth: '120px' }}
            >
              SVG
            </Button>
          </Box>
        </Box>
      </CardContent>

      {/* Dialog de prévisualisation */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          QR Code - {poi.name}
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          {qrCodeUrl && (
            <Box>
              <img
                src={qrCodeUrl}
                alt={`QR Code pour ${poi.name}`}
                style={{
                  maxWidth: '256px',
                  maxHeight: '256px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: 'white'
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                URL: https://naonair.app/poi/{poi.poi_id}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Scannez ce code pour accéder directement au POI
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDownload('png')} startIcon={<Download />}>
            Télécharger PNG
          </Button>
          <Button onClick={() => handleDownload('svg')} startIcon={<Download />}>
            Télécharger SVG
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default POIQRCodeItem;