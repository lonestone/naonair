# Plan d'implémentation QR Code POI - Version Affinée

## Découvertes importantes via analyse Serena

### Architecture POI existante
- POI proviennent de GeoServer (`aireel:poi_data`) - **pas de base locale**
- Interface POI bien définie avec `poi_id` unique dans `app/src/actions/poi.ts`
- Navigation React Native déjà en place (`POIDetails` screen)
- **Pas d'API endpoints POI côté NestJS** - tout vient de GeoServer

### Points critiques identifiés
- ❌ **Aucun deep linking configuré** (AndroidManifest.xml et Info.plist vierges)
- ❌ **Pas d'API POI backend** (uniquement GeoServer)
- ✅ Navigation React Native bien structurée
- ✅ Interface POI mature avec gestion favoris

## Plan d'implémentation amélioré

### Phase 1 : API QR Code (Simplifié)
Au lieu de créer une entité POI complète, créer un service QR Code qui :
1. **Service QR Code** dans `api/src/modules/qrcodes/`
   - Service de génération QR avec bibliothèque `qrcode`
   - Génération à la demande (pas de stockage)
2. **Endpoint** : `GET /qrcodes/poi/:poi_id` 
   - Support PNG transparent + SVG
3. **URL QR** : `https://naonair.app/poi/{poi_id}` (stable)

### Phase 2 : Backoffice QR Code
1. **Nouvelle route** `ARRoutes.QRCodes = "/qrcodes"` dans `router/routes.ts`
2. **Template** `QRCodeTemplate.tsx` : 
   - Liste POI depuis GeoServer (réutilise logique existante)
   - Pas de duplication de données
3. **Composant** `POIQRCodeItem.tsx` : 
   - Affiche nom, adresse POI
   - Boutons download PNG/SVG via API QR Code
4. **Navigation** : Ajout onglet dans `App.tsx`

### Phase 3 : Deep Linking Mobile
1. **AndroidManifest.xml** : 
   - Intent filter pour `naonair://poi/*`
   - Intent filter pour `https://naonair.app/poi/*`
2. **Info.plist** : 
   - URL Schemes
   - Associated Domains
3. **React Navigation Linking** : 
   - Config dans `NavigatorScreen.tsx` 
   - Réutilise la navigation existante
4. **Handler** : 
   - Route vers `POIDetails` avec `poi_id`
   - Récupération POI via `getOne(poi_id)` existant

### Phase 4 : Landing Page Web
Simple service web pour :
- Détection User-Agent → Redirect store ou deep link
- Page "POI non disponible" pour POI supprimés
- Peut être intégré à l'API NestJS existante

## Avantages de cette approche

- **Moins invasif** : Pas de duplication des données POI
- **Utilise l'existant** : Navigation et interface POI déjà matures
- **GeoServer reste master** : Cohérence des données garantie
- **QR Code à la demande** : Pas de stockage, génération dynamique
- **Architecture cohérente** : S'appuie sur les patterns existants

## Questions/décisions à prendre

1. **Domaine** : `naonair.app` existe-t-il ? Ou utiliser le domaine API existant ?
2. **POI supprimés** : Comment détecter si un POI n'existe plus dans GeoServer ?
3. **Universal Links** : Besoin d'un fichier AASA sur le serveur
4. **Cache QR Codes** : Générer à la demande ou cache temporaire ?

## Dépendances techniques

### Nouvelles dépendances
- **API** : `qrcode` pour génération QR codes
- **App** : Configuration linking React Navigation (déjà présent)

### Fichiers à modifier
- `api/src/modules/` : Nouveau module qrcodes
- `backoffice/src/` : Nouveaux composants QR Code
- `android/app/src/main/AndroidManifest.xml` : Intent filters
- `ios/aireal/Info.plist` : URL Schemes
- `app/src/screens/NavigatorScreen.tsx` : Linking config

## Architecture finale
```
QR Code Scan → Web Landing → User-Agent Detection → 
├─ App installée: naonair://poi/123 → POIDetails(poi_id=123)
└─ App non installée: Store redirect
```