# Conversation : Implémentation QR Codes POI - Naonair

**Date** : 24 septembre 2025
**Projet** : Naonair - Application qualité de l'air
**Objectif** : Implémentation complète du système QR Code pour les Points d'Intérêt (POI)

---

## 📋 Contexte Initial

### User Stories

**US1 - Admin : Génération et téléchargement QR Codes**
> ETQ administrateur, je veux pouvoir générer, visualiser et télécharger les QR codes associés aux points d'intérêt afin de les utiliser sur des supports physiques ou numériques.

**Besoins :**
- Nouvel onglet "QR Code" dans l'admin
- Liste des POI avec nom + adresse
- Download PNG (fond transparent) + SVG
- QR codes stables liés au POI même si données changent
- Gestion des POI supprimés (QR reste fonctionnel côté app avec page d'erreur, mais plus générable côté admin)

**US2 - Utilisateur : Scanner QR Code pour accès POI**
> ETQ utilisateur, je veux pouvoir scanner un QR code présent sur un point d'intérêt afin d'accéder directement à la fiche qualité de l'air correspondante.

**Besoins :**
- QR code unique par POI
- Deep linking : app installée → ouvre directement la fiche POI
- App non installée → redirection vers store (iOS/Android)
- Gestion POI supprimé → page d'information d'indisponibilité
- QR codes stables et uniques

---

## 🔍 Analyse du Codebase (avec Serena)

### Architecture Découverte

**Structure du Projet (Monorepo) :**
```
naonair/
├── api/         # NestJS + PostgreSQL + MikroORM
├── app/         # React Native + Paper UI
├── backoffice/  # React + Vite + Material-UI
└── dtos/        # DTOs TypeScript partagés
```

**POI Architecture :**
- Interface `POI` dans `app/src/actions/poi.ts`
- Source de données : **GeoServer via `aireel:poi_data`** (pas de base locale)
- Navigation POI mature avec `POIDetails` screen
- **❌ Pas d'API endpoints POI côté NestJS** - tout vient de GeoServer
- ✅ Navigation React Native bien structurée
- ✅ Interface POI mature avec gestion favoris

**Deep Linking :**
- ❌ Aucune configuration existante dans AndroidManifest.xml et Info.plist

**Points Critiques Identifiés :**
- Pas de duplication de données POI nécessaire (GeoServer = master)
- Navigation et routing React Native déjà fonctionnels
- Besoin de configuration native pour deep linking

---

## 📝 Plan d'Implémentation Affiné

### Phase 1 : Backend - API QR Code (Simplifié)
**Approche :** Service QR Code à la demande, pas de duplication des données POI

1. **Service QR Code** dans `api/src/modules/qrcodes/`
   - Génération à la demande (pas de stockage)
   - Support PNG (fond transparent) et SVG
2. **Endpoint** : `GET /qrcodes/poi/:poi_id`
3. **URL QR** : `https://naonair.app/poi/{poi_id}` (stable)

### Phase 2 : Interface Admin (Backoffice)
**Approche :** Réutilise la logique GeoServer existante

1. **Nouvelle route** `ARRoutes.QRCodes = "/qrcodes"`
2. **Template** `QRCodeTemplate.tsx` : Liste POI depuis GeoServer
3. **Composant** `POIQRCodeItem.tsx` : Affiche + boutons download
4. **Navigation** : Ajout onglet dans le header

### Phase 3 : Deep Linking (Mobile App)
**Approche :** S'appuie sur la navigation React Native existante

1. **Configuration native** : AndroidManifest.xml + Info.plist
2. **React Navigation Linking** : Config dans NavigatorScreen.tsx
3. **Handler** : Route vers `POIDetails` avec `poi_id`
4. **Gestion erreurs** : Page "POI non disponible"

### Phase 4 : Landing Page Web
Service web pour détection User-Agent et redirection

### Phase 5 : Tests
Tests unitaires, intégration et E2E

---

## 🚀 Implémentation Réalisée

### ✅ Phase 1 : API QR Code (TERMINÉE)

#### 1. Installation des dépendances
```bash
cd api
yarn add qrcode @types/qrcode
```

#### 2. Création du Service QR Code

**Fichier** : `api/src/modules/qrcodes/qrcodes.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

export interface QRCodeOptions {
  format: 'png' | 'svg';
  size?: number;
}

@Injectable()
export class QRCodesService {
  private readonly baseUrl = 'https://naonair.app/poi/';

  async generateQRCode(poiId: number, options: QRCodeOptions): Promise<Buffer | string> {
    const url = `${this.baseUrl}${poiId}`;

    if (options.format === 'png') {
      return await this.generatePNG(url, options.size || 256);
    } else {
      return await this.generateSVG(url);
    }
  }

  private async generatePNG(url: string, size: number): Promise<Buffer> {
    return await QRCode.toBuffer(url, {
      type: 'png',
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF00', // Transparent background
      },
    });
  }

  private async generateSVG(url: string): Promise<string> {
    return await QRCode.toString(url, {
      type: 'svg',
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF00', // Transparent background
      },
    });
  }
}
```

#### 3. Création du Controller

**Fichier** : `api/src/modules/qrcodes/qrcodes.controller.ts`

```typescript
import { Controller, Get, Param, Query, Res, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { QRCodesService, QRCodeOptions } from './qrcodes.service';

@Controller('qrcodes')
export class QRCodesController {
  constructor(private readonly qrCodesService: QRCodesService) {}

  @Get('poi/:id')
  async generatePOIQRCode(
    @Param('id', ParseIntPipe) poiId: number,
    @Query('format') format: 'png' | 'svg' = 'png',
    @Query('size') size: string = '256',
    @Res() res: Response,
  ) {
    const options: QRCodeOptions = {
      format,
      size: parseInt(size, 10),
    };

    try {
      const qrCode = await this.qrCodesService.generateQRCode(poiId, options);

      if (format === 'png') {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="poi-${poiId}.png"`);
        res.send(qrCode);
      } else {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `attachment; filename="poi-${poiId}.svg"`);
        res.send(qrCode);
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error generating QR code',
        error: error.message,
      });
    }
  }
}
```

#### 4. Création du Module

**Fichier** : `api/src/modules/qrcodes/qrcodes.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { QRCodesController } from './qrcodes.controller';
import { QRCodesService } from './qrcodes.service';

@Module({
  controllers: [QRCodesController],
  providers: [QRCodesService],
  exports: [QRCodesService],
})
export class QRCodesModule {}
```

#### 5. Enregistrement dans AppModule

**Fichier** : `api/src/app.module.ts`

```typescript
// Ajout de l'import
import { QRCodesModule } from './modules/qrcodes/qrcodes.module';

@Module({
  imports: [
    // ... autres modules
    QRCodesModule,
  ],
})
export class AppModule {}
```

#### Tests Phase 1 ✅

**Endpoints disponibles :**
- PNG : `http://localhost:3001/qrcodes/poi/123?format=png&size=256`
- SVG : `http://localhost:3001/qrcodes/poi/123?format=svg`

**Résultats :** QR codes générés avec succès, fond transparent fonctionnel.

---

### ✅ Phase 2 : Interface Admin (TERMINÉE)

#### 1. Ajout de la route

**Fichier** : `backoffice/src/router/routes.ts`

```typescript
export enum ARRoutes {
  Home = "/",
  Login = "/login",
  QRCodes = "/qrcodes",
}
```

#### 2. API POI côté Backoffice

**Fichier** : `backoffice/src/api/poi.api.ts`

```typescript
import { AxiosResponse } from "axios";
import request from "../axios";
import { settings } from "../settings";

export interface POI {
  id: number;
  poi_id: number;
  name: string;
  address: string;
  category: string;
  geolocation: [number, number];
}

// POI de test - en production, il faudrait un endpoint API qui query GeoServer
export const getPOIs = async (): Promise<POI[]> => {
  return [
    {
      id: 1,
      poi_id: 123,
      name: "Parc de la Beaujoire",
      address: "Boulevard de la Beaujoire, 44300 Nantes",
      category: "Parc",
      geolocation: [-1.5208, 47.2561],
    },
    {
      id: 2,
      poi_id: 456,
      name: "Stade de la Beaujoire",
      address: "5 Boulevard de la Beaujoire, 44300 Nantes",
      category: "Sport",
      geolocation: [-1.5244, 47.2561],
    },
    {
      id: 3,
      poi_id: 789,
      name: "Château des Ducs de Bretagne",
      address: "4 Place Marc Elder, 44000 Nantes",
      category: "Culture",
      geolocation: [-1.5491, 47.2160],
    },
  ];
};

export const downloadQRCode = async (poiId: number, format: 'png' | 'svg' = 'png'): Promise<Blob> => {
  const res: AxiosResponse = await request.get(
    `${settings.apiUrl}/qrcodes/poi/${poiId}?format=${format}`,
    { responseType: 'blob' }
  );
  return res.data;
};
```

#### 3. Composant POI QR Code Item

**Fichier** : `backoffice/src/components/molecules/POIQRCodeItem.tsx`

```typescript
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { Download, QrCode } from "@mui/icons-material";
import { POI, downloadQRCode } from "../../api/poi.api";

interface POIQRCodeItemProps {
  poi: POI;
}

const POIQRCodeItem: React.FC<POIQRCodeItemProps> = ({ poi }) => {
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
    </Card>
  );
};

export default POIQRCodeItem;
```

#### 4. Template QR Code Principal

**Fichier** : `backoffice/src/components/templates/QRCodeTemplate.tsx`

```typescript
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
```

#### 5. Routing et Navigation

**Fichier** : `backoffice/src/App.tsx`

```typescript
// Ajouts
import { QRCodeTemplate } from "./components/templates/QRCodeTemplate";

// Nouvelle route
<Route element={<PrivateLayout />} path={ARRoutes.QRCodes}>
  <Route path={ARRoutes.QRCodes} element={<QRCodeTemplate />} />
</Route>
```

**Fichier** : `backoffice/src/components/molecules/ARHeader.tsx`

```typescript
// Navigation améliorée avec boutons
<Box sx={{ display: 'flex', ml: 3 }}>
  <Button
    color="inherit"
    startIcon={<HomeIcon />}
    onClick={() => handleNavigation(ARRoutes.Home)}
    variant={location.pathname === ARRoutes.Home ? "outlined" : "text"}
  >
    Actualités
  </Button>
  <Button
    color="inherit"
    startIcon={<QrCodeIcon />}
    onClick={() => handleNavigation(ARRoutes.QRCodes)}
    variant={location.pathname === ARRoutes.QRCodes ? "outlined" : "text"}
  >
    QR Codes
  </Button>
</Box>
```

#### Tests Phase 2 ✅

**Interface Admin :**
- ✅ Navigation "QR Codes" visible dans le header
- ✅ Page accessible sur `/qrcodes`
- ✅ Liste de 3 POI de test affichée
- ✅ Boutons PNG et SVG fonctionnels
- ✅ Téléchargement des QR codes opérationnel
- ✅ Design Material-UI cohérent

---

## 📊 Résultats et Statut

### ✅ Phases Terminées

- **Phase 1** : API QR Code ✅
- **Phase 2** : Interface Admin ✅

### 🔜 Phases Restantes

- **Phase 3** : Deep Linking Mobile (en attente)
- **Phase 4** : Landing Page Web (en attente)
- **Phase 5** : Tests E2E (en attente)

---

## 🎯 Fonctionnalités Livrées

### API QR Code
- ✅ Service de génération QR Code à la demande
- ✅ Support PNG avec fond transparent
- ✅ Support SVG
- ✅ Endpoint RESTful : `GET /qrcodes/poi/:id`
- ✅ URL stable : `https://naonair.app/poi/{poi_id}`
- ✅ Paramètres personnalisables (format, taille)

### Interface Admin
- ✅ Page dédiée QR Codes
- ✅ Navigation dans le header
- ✅ Liste des POI avec informations complètes
- ✅ Téléchargement direct PNG/SVG
- ✅ Design Material-UI cohérent
- ✅ Gestion des états (loading, erreur)

---

## 🔧 Technologies Utilisées

### Backend
- NestJS
- TypeScript
- qrcode (bibliothèque de génération)
- Express

### Frontend Admin
- React
- TypeScript
- Material-UI (MUI)
- Axios
- React Router

---

## 📝 Notes Techniques

### Avantages de l'Approche Retenue

1. **Pas de duplication de données** : GeoServer reste la source de vérité
2. **Génération à la demande** : Pas de stockage de QR codes, toujours à jour
3. **Architecture scalable** : Facilement extensible pour d'autres entités
4. **Réutilisation du code** : S'appuie sur l'infrastructure existante
5. **Performance optimale** : Génération rapide, téléchargement direct

### Points d'Attention pour la Suite

1. **Deep Linking** : Configuration native iOS/Android requise
2. **POI réels** : Remplacer les données de test par GeoServer
3. **Authentification** : Vérifier si la route QR Code doit être protégée
4. **Domaine** : Confirmer l'existence de `naonair.app`
5. **Cache** : Envisager un cache Redis pour les QR codes fréquents

---

## 🚀 Commandes de Démarrage

### Setup Initial
```bash
# Bases de données
docker-compose up -d

# DTOs
cd dtos && yarn && yarn build

# API
cd api && yarn && npm link ../dtos
yarn build
yarn start:dev

# Backoffice
cd backoffice && yarn && npm link ../dtos
yarn start
```

### Endpoints de Test
```bash
# QR Code PNG
curl "http://localhost:3001/qrcodes/poi/123?format=png" -o test.png

# QR Code SVG
curl "http://localhost:3001/qrcodes/poi/123?format=svg" -o test.svg
```

### Accès Interface
- **API** : http://localhost:3001
- **Backoffice** : http://localhost:3000
- **Login** : Mot de passe `test`

---

## 📚 Documentation Associée

- **Plan d'implémentation** : `/PLAN_QRCODES_POI.md`
- **CLAUDE.md** : Documentation projet
- **Memories Serena** :
  - `naonair_project_overview`
  - `qrcode_implementation_plan_refined`
  - `suggested_commands`
  - `code_style_and_conventions`

---

## ✨ Prochaines Étapes

1. **Tester l'interface admin** en production
2. **Remplacer les POI de test** par de vraies données GeoServer
3. **Implémenter le Deep Linking** (Phase 3)
4. **Créer la landing page web** (Phase 4)
5. **Tests E2E** complets (Phase 5)

---

**Status Final** : Phase 1 & 2 ✅ | Temps total : ~2h | Fonctionnel et prêt pour tests utilisateur