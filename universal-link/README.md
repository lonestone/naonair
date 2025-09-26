# Universal Links Configuration

Ce répertoire contient les fichiers de vérification pour les Universal Links.

## Fichiers

- `.well-known/apple-app-site-association` : Configuration iOS Universal Links
- `.well-known/assetlinks.json` : Configuration Android App Links

## Déploiement

Ces fichiers doivent être accessibles à :
- `https://naonair-api-staging.onrender.com/.well-known/apple-app-site-association`
- `https://naonair-api-staging.onrender.com/.well-known/assetlinks.json`

## Configuration

### iOS
- **Team ID**: YR674NJJDX
- **Bundle ID**: org.airpl.naonair
- **Paths**: /poi/*

### Android
- **Package**: com.aireal
- **SHA-256**: C9:BB:FB:E4:1D:34:E8:FC:BD:6F:A7:6D:DF:6E:AA:38:20:4C:D3:A0:53:9A:7F:5B:79:BF:8F:07:83:5F:54:B5

## Vérification

Après déploiement, tester avec :
- **iOS**: https://search.developer.apple.com/appsearch-validation-tool/
- **Android**: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://naonair-api-staging.onrender.com&relation=delegate_permission/common.handle_all_urls