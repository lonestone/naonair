# Plan d'implémentation : QR Codes pour POI

## User Stories

### US1 - Admin : Génération et téléchargement QR Codes
**ETQ** administrateur, **je veux** pouvoir générer, visualiser et télécharger les QR codes associés aux points d'intérêt **afin de** les utiliser sur des supports physiques ou numériques.

- Nouvel onglet "QR Code" dans l'admin
- Liste des POI avec nom + adresse
- Download PNG (fond transparent) + SVG
- QR codes stables liés au POI même si données changent
- Gestion des POI supprimés (QR reste fonctionnel côté app avec page d'erreur, mais plus générable côté admin)

### US2 - Utilisateur : Scanner QR Code pour accès POI
**ETQ** utilisateur, **je veux** pouvoir scanner un QR code présent sur un point d'intérêt **afin d'** accéder directement à la fiche qualité de l'air correspondante.

- QR code unique par POI
- Deep linking : app installée → ouvre directement la fiche POI
- App non installée → redirection vers store (iOS/Android)
- Gestion POI supprimé → page d'information d'indisponibilité
- QR codes stables et uniques

## 🔍 Architecture actuelle identifiée (via analyse Serena)

**POI Structure :**
- Interface `POI` dans `app/src/actions/poi.ts` avec `id`, `poi_id`, `name`, `address`, `geolocation`
- Source de données : **GeoServer via `aireel:poi_data`** (pas de base locale)
- Navigation POI déjà mature avec `POIDetails` screen
- Admin actuel : Interface simple avec gestion des News uniquement

**Deep linking :** ❌ Aucune configuration existante dans AndroidManifest.xml et Info.plist

**Points critiques :**
- ❌ **Pas d'API endpoints POI côté NestJS** - tout vient de GeoServer
- ✅ Navigation React Native bien structurée
- ✅ Interface POI mature avec gestion favoris

## 📋 Plan d'implémentation (AMÉLIORÉ)

### **Phase 1 : API QR Code (Simplifié)**
**Approche :** Service QR Code à la demande, **pas de duplication** des données POI

1. **Service QR Code** dans `api/src/modules/qrcodes/`:
   - Service de génération QR avec bibliothèque `qrcode`
   - **Génération à la demande** (pas de stockage)
   - Support formats PNG (fond transparent) et SVG
2. **Endpoint** : `GET /qrcodes/poi/:poi_id`
3. **URL QR** : `https://naonair.app/poi/{poi_id}` (stable)

### **Phase 2 : Interface Admin (Backoffice)**
**Approche :** Réutilise la logique GeoServer existante

1. **Nouvelle route** `ARRoutes.QRCodes = "/qrcodes"` dans `router/routes.ts`
2. **Template** `QRCodeTemplate.tsx` :
   - Liste POI depuis GeoServer (réutilise logique existante)
   - **Pas de duplication** de données
3. **Composant** `POIQRCodeItem.tsx` :
   - Affiche nom, adresse POI
   - Boutons download PNG/SVG via API QR Code
4. **Navigation** : Ajout onglet dans `App.tsx`

### **Phase 3 : Deep Linking (Mobile App)**
**Approche :** S'appuie sur la navigation React Native existante

1. **Configuration native** :
   - `android/app/src/main/AndroidManifest.xml` : Intent filters pour `naonair://poi/*` et `https://naonair.app/poi/*`
   - `ios/aireal/Info.plist` : URL Schemes et Associated Domains
2. **React Navigation Linking** :
   - Config dans `NavigatorScreen.tsx` (réutilise navigation existante)
   - Handler : Route vers `POIDetails` avec `poi_id`
   - Récupération POI via `getOne(poi_id)` **existant**
3. **Gestion des cas d'erreur** :
   - Page "POI non disponible" pour POI supprimés
   - Fallback vers stores si app non installée

### **Phase 4 : Page de redirection Web**
1. **Créer service Web simple** (peut être intégré à l'API)
2. **Routes** :
   - `/poi/:id` → Détection User-Agent → Redirection store ou deep link
   - `/poi/:id/unavailable` → Page d'information POI supprimé

### **Phase 5 : Tests et mise en production**
1. **Tests unitaires** pour génération QR codes
2. **Tests d'intégration** pour deep linking
3. **Tests E2E** parcours complet QR scan → Ouverture POI

## 🔧 Avantages de l'approche affinée

- **Moins invasif** : Pas de duplication des données POI
- **Utilise l'existant** : Navigation et interface POI déjà matures
- **GeoServer reste master** : Cohérence des données garantie
- **QR Code à la demande** : Pas de stockage, génération dynamique
- **Architecture cohérente** : S'appuie sur les patterns existants

## 🤔 Questions/décisions à prendre

1. **Domaine** : `naonair.app` existe-t-il ? Ou utiliser le domaine API existant ?
2. **POI supprimés** : Comment détecter si un POI n'existe plus dans GeoServer ?
3. **Universal Links** : Besoin d'un fichier AASA sur le serveur
4. **Cache QR Codes** : Générer à la demande ou cache temporaire ?

## Points techniques clés

- **QR Code stable** : Utiliser `poi_id` (unique et permanent)
- **URL Format** : `https://naonair.app/poi/{poi_id}`
- **Universal Links iOS** : Configuration domaine + AASA file
- **App Links Android** : Intent filters + vérification domaine
- **Génération QR** : PNG transparent + SVG pour flexibilité usage

## Architecture finale
```
QR Code Scan → Web Landing → User-Agent Detection →
├─ App installée: naonair://poi/123 → POIDetails(poi_id=123)
└─ App non installée: Store redirect
```

## Dépendances techniques

### Nouvelles dépendances à ajouter
- **API** : `qrcode` pour génération QR codes
- **App** : `@react-navigation/native` (déjà présent mais config linking à ajouter)
- **Web redirect** : Express simple ou intégration à NestJS existant

### Fichiers de configuration
- `android/app/src/main/AndroidManifest.xml` : Intent filters
- `ios/aireal/Info.plist` : URL Schemes
- Domain verification files pour Universal/App Links